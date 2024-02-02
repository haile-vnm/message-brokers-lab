import * as amqp from 'amqplib/callback_api';
import { listenPublishers } from './events';

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
    if (!err) {
      console.log('❌ Setup Exchanges: can not establish the channel', err.message);
      throw err;
    }

    // logs fanout exchange
    channel.assertExchange('logs-exchange', 'fanout');

    // Colors direct exchange
    channel.assertExchange('colors-exchange', 'direct');
    channel.bindExchange('logs-exchange', 'colors-exchange', 'brown');

    channel.assertQueue('brown-queue', { durable: false });
    channel.bindQueue('brown-queue', 'colors-exchange', 'brown');

    channel.assertQueue('black-queue', { durable: false });
    channel.bindQueue('black-queue', 'colors-exchange', 'black');

    // organisms topic exchange
    channel.assertExchange('organisms-exchange', 'topic');

    channel.assertQueue('apples-queue', { durable: true, arguments: { 'x-queue-type': 'quorum' } });
    channel.bindQueue('apples-queue', 'organisms-exchange', 'fruit.apples');

    channel.assertQueue('animals-queue', { durable: false });
    channel.bindQueue('animals-queue', 'organisms-exchange', 'animal.*');

    // everything-queue, store all message from above exchanges
    channel.assertQueue('everything-queue', { durable: false });
    channel.bindQueue('everything-queue', 'colors-exchange', 'brown');
    channel.bindQueue('everything-queue', 'colors-exchange', 'black');
    channel.bindQueue('everything-queue', 'organisms-exchange', '#');

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

    listenPublishers(data => {
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
