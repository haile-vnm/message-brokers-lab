import * as amqp from 'amqplib/callback_api';

export const newTask = (message: string, queueName: string) => {
  amqp.connect(process.env.RABBITMQ_ENDPOINT, function(error0, connection) {
      if (error0) {
          throw error0;
      }
      connection.createChannel(function(error1, channel) {
          if (error1) {
              throw error1;
          }
          const msg = message || 'Hello World!';

          channel.assertQueue(queueName, {
              durable: true
          });
          channel.sendToQueue(queueName, Buffer.from(msg), {
              persistent: true
          });
          console.log(' [x] Sent "%s"', msg);
      });
      setTimeout(function() {
          connection.close();
          process.exit(0);
      }, 500);
  });
}
