import express from 'express';
import { publishMessage } from './integrations/rabbitmq/events';
import { getEnv } from './helpers/env';
import { init as initRabbitmqBroker } from './integrations/rabbitmq/broker';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
initRabbitmqBroker();

app.post('/logs', (req, res) => {
  publishMessage({ xName: getEnv('X_LOGS'), message: req.body.message })
  res.json({ ok: Date.now() });
});

app.post('/colors', (req, res) => {
  const { color, types } = req.body;
  publishMessage({ xName: getEnv('X_ORGANISMS'), message: color, routingKey: [].concat(types).join('.') });
  res.json({ ok: Date.now() });
});

app.post('/animals', (req, res) => {
  const { animal, types } = req.body;
  publishMessage({ xName: getEnv('X_ORGANISMS'), message: animal, routingKey: ['animal'].concat(types).join('.') });
  res.json({ ok: Date.now() });
});

app.post('/fruits', (req, res) => {
  const { fruit, types } = req.body;
  publishMessage({ xName: getEnv('X_ORGANISMS'), message: fruit, routingKey: ['fruit'].concat(types).join('.') });
  res.json({ ok: Date.now() });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
