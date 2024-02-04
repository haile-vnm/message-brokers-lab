import amqp from 'amqplib/callback_api';
import getEnv from './helpers/env';

amqp.connect(getEnv('RABBITMQ_ENDPOINT'), function(conError, connection) {
  if (conError) {
    throw conError;
  }
  connection.createChannel(function(channelError, channel) {
    if (channelError) {
      throw channelError;
    }

    const exchange = getEnv('X_LOGS');

    channel.assertQueue('', {
      exclusive: true
    }, function(qError, q) {
      if (qError) {
        throw qError;
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      channel.bindQueue(q.queue, exchange, '');

      channel.consume(q.queue, function(msg) {
        if (msg.content) {
          console.log(" [x] %s", msg.content.toString());
        }
      }, {
        noAck: true
      });
    });
  });
});
