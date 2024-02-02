import * as amqp from 'amqplib/callback_api';
import { registerPublishers } from './events';
import { getEnv } from '../../helpers/env';

export const init = () => {
  amqp.connect(process.env.RABBITMQ_ENDPOINT, function(connectionError, connection) {
    if (connectionError) {
      throw connectionError;
    }

    initializeBrokerResources(connection);

    publishMessage(connection);
  });
}

const initializeBrokerResources = (connection: amqp.Connection) => {
  connection.createChannel((err, channel) => {
    if (err) {
      console.log('❌ Setup Exchanges: can not establish the channel', err);
      throw err;
    }

    // logs fanout exchange
    channel.assertExchange(getEnv('X_LOGS'), 'fanout');

    // Colors direct exchange
    channel.assertExchange(getEnv('X_COLORS'), 'direct');
    channel.bindExchange(getEnv('X_LOGS'), getEnv('X_COLORS'), 'brown');

    channel.assertQueue(getEnv('Q_BROWN'), { durable: false });
    channel.bindQueue(getEnv('Q_BROWN'), getEnv('X_COLORS'), 'brown');

    channel.assertQueue(getEnv('Q_BLACK'), { durable: false });
    channel.bindQueue(getEnv('Q_BLACK'), getEnv('X_COLORS'), 'black');

    // organisms topic exchange
    channel.assertExchange(getEnv('X_ORGANISMS'), 'topic');

    channel.assertQueue(getEnv('Q_APPLES'), { durable: true, arguments: { 'x-queue-type': 'quorum' } });
    channel.bindQueue(getEnv('Q_APPLES'), getEnv('X_ORGANISMS'), 'fruit.apple');

    channel.assertQueue(getEnv('Q_ANIMALS'), { durable: false });
    channel.bindQueue(getEnv('Q_ANIMALS'), getEnv('X_ORGANISMS'), 'animal.*');

    // everything-queue, store all message from above exchanges
    channel.assertQueue(getEnv('Q_EVERYTHING'), { durable: false });
    channel.bindQueue(getEnv('Q_EVERYTHING'), getEnv('X_COLORS'), 'brown');
    channel.bindQueue(getEnv('Q_EVERYTHING'), getEnv('X_COLORS'), 'black');
    channel.bindQueue(getEnv('Q_EVERYTHING'), getEnv('X_ORGANISMS'), '#');

    setTimeout(() => {
      channel.close(err => {
        if (err) {
          return console.log('❌ Initialize Broker Resources: Can not close channel', err.message);
        }

        console.log('✅ Initialize Broker Resources:: channel closed!');

      });
    }, 10000 /* 10 seconds */)
  });
};

const publishMessage = (connection: amqp.Connection) => {
  connection.createChannel(function (channelError, channel) {
    if (channelError) {
      throw channelError;
    }

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
