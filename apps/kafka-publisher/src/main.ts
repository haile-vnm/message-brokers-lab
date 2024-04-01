import express from 'express';
import { publishColors } from './integrations/kafka/colors-publisher';
import { publishLog } from './integrations/kafka/logs-publisher';
import { init } from './integrations/kafka/broker';
import getEnv from './helpers/env';
import bodyParser from 'body-parser';

const host = process.env.HOST ?? 'localhost';
const port = Number(getEnv('PORT') || 3000);

init().then(() => {
  const app = express();
  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    res.send({ message: 'Hello API' });
  });

  app.post('/colors', (req, res) => {
    const { color, types } = req.body;
    const colorCategory = [].concat(types).join('.');
    const id = crypto.randomUUID();

    publishColors([{ color, id }], colorCategory);
    publishLog([{ content: color, id }], 'color');
    res.json({ ok: Date.now() });
  });

  app.post('/animals', (req, res) => {
    const { animal, types } = req.body;
    const animalType = ['animal'].concat(types).join('.');
    publishLog([{ content: animal, id: crypto.randomUUID() }], animalType )
    res.json({ ok: Date.now() });
  });

  app.listen(port, '0.0.0.0', () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
})
