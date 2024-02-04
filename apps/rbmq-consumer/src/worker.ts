import amqp from 'amqplib/callback_api';
import getEnv from './helpers/env';
import { argv } from '@message-brokers-lab/env';

amqp.connect(getEnv('RABBITMQ_ENDPOINT'), function(conError, connection) {
  if (conError) {
    throw conError;
  }
  connection.createChannel(function(channelError, channel) {
    if (channelError) {
      throw channelError;
    }
    channel.prefetch(2);
    const queues = argv.queue
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
    if (!queues.length) {
      throw 'There no queue provided!!';
    }

    queues.forEach(queue => consumeQueue(channel, queue));
  });
});

const consumeQueue = (channel: amqp.Channel, queue: string) => {
  channel.consume(queue, msg => {
    const task: Record<string, unknown> = {};
    const content = msg.content.toString();

    try {
      Object.assign(task, JSON.parse(content));
    } catch (_) {
      // do nothing
    }

    const secs = +task.seconds || 0;

    console.log("🛬 Received %s", content, 'at', new Date());
    setTimeout(function () {
      console.log("✅ Done %s at %s", content, new Date());
      channel.ack(msg);
    }, secs * 1000);
  }, {
    noAck: false
  });
}

