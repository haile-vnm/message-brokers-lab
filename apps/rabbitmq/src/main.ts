import express from 'express';
import * as bodyParser from 'body-parser';
import { publishMessage } from './integrations/rabbitmq/events';
import { getEnv } from './helpers/env';
import { init as initRabbitmqBroker } from './integrations/rabbitmq/broker';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

initRabbitmqBroker().then(() => {
  const app = express();
  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    console.log('Incoming path "/" at', new Date());

    res.json({ ok: Date.now() });
  });

  app.use((req, _, next) => {
    publishMessage({
      xName: getEnv('X_LOGS'),
      message: `🚀 Incoming ${req.path} by ${req.ip} at ${new Date().toString()}`
    });
    next();
  })

  app.post('/colors', (req, res) => {
    const { color, types } = req.body;
    publishMessage({
      xName: getEnv('X_COLORS'),
      message: color, routingKey: [].concat(types).join('.')
    });
    res.json({ ok: Date.now() });
  });

  app.post('/animals', (req, res) => {
    const { animal, types } = req.body;
    publishMessage({
      xName: getEnv('X_ORGANISMS'),
      message: animal, routingKey: ['animal'].concat(types).join('.')
    });
    res.json({ ok: Date.now() });
  });

  app.post('/fruits', (req, res) => {
    const { fruit, types } = req.body;
    publishMessage({
      xName: getEnv('X_ORGANISMS'),
      message: fruit, routingKey: ['fruit'].concat(types).join('.')
    });
    res.json({ ok: Date.now() });
  });

  app.listen(port, '0.0.0.0', () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}).catch(err => {
  console.log('❌ Initialize AMQP Error', err);
  process.exit(0);
});
