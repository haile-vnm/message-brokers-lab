import getEnv from '../../helpers/env'
import ProducerFactory from './broker'

export const publishColors = async (messages: { color: string, id: string }[], category: string) => {
  const producer = await ProducerFactory.create();

  producer.sendBatch(getEnv('COLORS_TOPIC'), messages, { key: category });
}
