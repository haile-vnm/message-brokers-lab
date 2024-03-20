import { getEnv } from '../../../helpers/env';
import { getStreamClient } from './brokers';
import { SuperStreamPublisher } from 'rabbitmq-stream-js-client/dist/super_stream_publisher';

let logPublisher: SuperStreamPublisher;

const getLogPublisher = async () => {
  const streamName = getEnv('RABBITMQ_STREAM_LOGS_NAME');
  if (!logPublisher) {
    logPublisher = await getStreamClient().declareSuperStreamPublisher({
      superStream: streamName,
    }, (message) => {
      try {
        return JSON.parse(message).category;
      } catch (error) {
        return String(Math.random());
      }
    });
  }

  return logPublisher;
}

export const streamLog = async (message: { content: string, category: string, id: string }) => {
  getLogPublisher().then(publisher => {
    publisher.send(Buffer.from(JSON.stringify(message)), { messageProperties: { messageId: message.id }});
  });
}
