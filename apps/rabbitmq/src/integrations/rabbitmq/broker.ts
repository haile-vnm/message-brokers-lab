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


    channel.assertExchange('logs-exchange', 'fanout');
    channel.assertExchange('animal-exchange', 'direct');
    channel.assertExchange('fruit-exchange', 'topic');

    channel.assertQueue('dogs-barking', { durable: true });
    channel.assertQueue('dogs-barking-replicated', { durable: true, arguments: { 'x-queue-type': 'quorum' } });

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
