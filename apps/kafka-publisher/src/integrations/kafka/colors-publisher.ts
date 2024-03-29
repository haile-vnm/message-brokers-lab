import getEnv from '../../helpers/env'
import ProducerFactory from './broker'

export const publishColors = async (messages: { color: string, id: string }[], category: string) => {
  const producer = await ProducerFactory.getInstance();

  producer.sendBatch(getEnv('COLORS_TOPIC'), messages, { key: category });
}
