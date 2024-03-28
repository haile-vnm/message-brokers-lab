import express from 'express';
import { publishColors } from './integrations/kafka/colors-publisher';
import { publishLog } from './integrations/kafka/logs-publisher';
import { init } from './integrations/kafka/broker';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

init().then(() => {
  const app = express();

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
    const { animal } = req.body;
    publishLog([{ content: animal, id: crypto.randomUUID() }], 'animals')
    res.json({ ok: Date.now() });
  });

  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
})
