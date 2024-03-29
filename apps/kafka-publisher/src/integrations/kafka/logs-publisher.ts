import getEnv from '../../helpers/env'
import ProducerFactory from './broker'

export const publishLog = async (messages: { content: string, id: string }[], category: string) => {
  const producer = await ProducerFactory.getInstance();

  producer.sendBatch(getEnv('LOGS_TOPIC'), messages, { key: category });
}
