import amqp from 'amqplib';
import { registerPublishers } from './events';
import { getEnv } from '../../helpers/env';

export const init = () => {
  return amqp.connect(process.env.RABBITMQ_ENDPOINT).then(async connection => {
    await initializeBrokerResources(connection);

    return publishMessage(connection);
  });
}

const initializeBrokerResources = (connection: amqp.Connection) => {
  return connection.createChannel().then(async channel => {
    // logs fanout exchange
    await channel.assertExchange(getEnv('X_LOGS'), 'fanout');

    // Colors direct exchange
    await channel.assertExchange(getEnv('X_COLORS'), 'direct');
    await channel.bindExchange(getEnv('X_LOGS'), getEnv('X_COLORS'), 'brown');

    await channel.assertQueue(getEnv('Q_BROWN'), { durable: false });
    await channel.bindQueue(getEnv('Q_BROWN'), getEnv('X_COLORS'), 'brown');

    await channel.assertQueue(getEnv('Q_BLACK'), { durable: false });
    await channel.bindQueue(getEnv('Q_BLACK'), getEnv('X_COLORS'), 'black');

    // organisms topic exchange
    await channel.assertExchange(getEnv('X_ORGANISMS'), 'topic');

    await channel.assertQueue(getEnv('Q_APPLES'), { durable: true, arguments: { 'x-queue-type': 'quorum' } });
    await channel.bindQueue(getEnv('Q_APPLES'), getEnv('X_ORGANISMS'), 'fruit.apple');

    await channel.assertQueue(getEnv('Q_ANIMALS'), { durable: false });
    await channel.bindQueue(getEnv('Q_ANIMALS'), getEnv('X_ORGANISMS'), 'animal.*');

    // everything-queue, store all message from above exchanges
    await channel.assertQueue(getEnv('Q_EVERYTHING'), { durable: false });
    await Promise.all([
      channel.bindQueue(getEnv('Q_EVERYTHING'), getEnv('X_COLORS'), 'brown'),
      channel.bindQueue(getEnv('Q_EVERYTHING'), getEnv('X_COLORS'), 'black'),
      channel.bindQueue(getEnv('Q_EVERYTHING'), getEnv('X_ORGANISMS'), '#'),
    ]);

    return channel.close();
  });
};

const publishMessage = (connection: amqp.Connection) => {
  return connection.createChannel().then(async channel => {
    registerPublishers(data => {
      const { xName } = data;

      if (!xName) {
        return channel.sendToQueue(data.routingKey, Buffer.from(JSON.stringify(data.message)), {
          persistent: true
        });
      }

      return channel.publish(
        xName,
        data.routingKey,
        Buffer.from(JSON.stringify(data.message))
      );
    });
  });
}
