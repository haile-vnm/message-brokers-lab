import express from 'express';
import { newTask } from './integrations/rabbitmq/new-tasks';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

newTask('', '');
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
