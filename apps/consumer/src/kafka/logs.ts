import getEnv from '../helpers/env';
import TopicConsumer from '../integrations/kafka/broker';

const logTopic = new TopicConsumer();

logTopic.startConsumer(
  getEnv('LOGS_TOPIC'),
  async payload => {
    const { message, partition  } = payload;
    console.log(`✅ Consuming ${getEnv('LOGS_TOPIC')} TOPIC, partion ${partition} message`, message.timestamp, message.value);
  }
);
