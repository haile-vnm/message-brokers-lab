import { Publisher } from 'rabbitmq-stream-js-client';
import { getEnv } from '../../../helpers/env';
import { getStreamClient } from './brokers';

let colorPublisher: Publisher;

const getColorPublisher = async () => {
  const streamName = getEnv('RABBITMQ_STREAM_COLORS_NAME');
  if (!colorPublisher) {
    colorPublisher = await getStreamClient().declarePublisher({
      stream: streamName
    });
  }

  return colorPublisher;
}

export const streamColor = async (message: { content: string, category: string, id: string }) => {
  getColorPublisher().then(publisher => {
    publisher.send(
      Buffer.from(JSON.stringify({ ...message, createdAt: new Date().toISOString() })),
      { messageProperties: { messageId: message.id } }
    );
  });
}
