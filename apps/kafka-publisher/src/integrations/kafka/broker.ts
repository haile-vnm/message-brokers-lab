import { Kafka, Message, Producer, ProducerBatch, TopicMessages } from 'kafkajs';
import getEnv from '../../helpers/env';

const createKafka = () => new Kafka({
  clientId: getEnv('APP_ID'),
  brokers: getEnv('KAFKA_BROKERS').split(/\s*,\s*/).filter(Boolean),
});

export default class ProducerFactory {
  private producer: Producer;
  private static instance: ProducerFactory;

  static async create() {
    if (!ProducerFactory.instance) {
      ProducerFactory.instance = new ProducerFactory();
      await ProducerFactory.instance.start()
    }

    return ProducerFactory.instance;
  }

  constructor() {
    this.producer = this.createProducer();
    this.start();
  }

  public async start(): Promise<void> {
    try {
      await this.producer.connect()
    } catch (error) {
      console.log('Error connecting the producer: ', error)
    }
  }

  public async shutdown() {
    return this.producer.disconnect()
  }

  public async sendBatch<T = unknown>(
    topic: string,
    messages: Array<T>,
    options?: Partial<Omit<Message, 'value'>>
  ) {
    if (messages.length === 0) {
      return;
    }

    const kafkaMessages: Array<Message> = messages.map((message) => {
      return {
        value: JSON.stringify(message),
        ...options
      }
    })

    const topicMessages: TopicMessages = {
      topic,
      messages: kafkaMessages
    };

    const batch: ProducerBatch = {
      topicMessages: [topicMessages]
    };

    return this.producer.sendBatch(batch);
  }

  private createProducer() : Producer {
    const kafka = createKafka();

    return kafka.producer();
  }
}

export const init = async () => {
  const kafka = createKafka();
  const admin = kafka.admin();

  admin.createTopics({
    topics: [
      {
        topic: getEnv('LOGS_TOPIC'),
        numPartitions: 3
      },
      {
        topic: getEnv('COLORS_TOPIC'),
        numPartitions: 5
      }
    ]
  })

  // remember to connect and disconnect when you are done
  await admin.connect()
  await admin.disconnect()
}
