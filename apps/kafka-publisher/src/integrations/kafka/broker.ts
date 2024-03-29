import { Kafka, Message, Partitioners, Producer, ProducerBatch, TopicMessages } from 'kafkajs';
import getEnv from '../../helpers/env';

const createKafka = () => new Kafka({
  clientId: getEnv('PUBLISHER_ID'),
  brokers: getEnv('KAFKA_BROKERS').split(/\s*,\s*/).filter(Boolean),
});

export default class ProducerFactory {
  private producer: Producer;
  private static instance: Promise<ProducerFactory>;

  static async getInstance() {
    if (!ProducerFactory.instance) {
      this.instance = new Promise(
        res => {
          const instance = new ProducerFactory();
          instance.start().then(() => res(instance));
        }
      );
    }

    return ProducerFactory.instance;
  }

  private constructor() {
    this.producer = this.createProducer();

    this.producer.on('producer.connect', (event) => {
      console.log('Kafka Producer connect successfully', event.type, event.timestamp);
    })

    this.producer.on('producer.disconnect', (event) => {
      // need to implement the logic to reconnect if needed
      console.log('Kafka Producer disconnected', event.type, event.timestamp);
    })
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
    return kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
  }
}

export const init = async () => {
  const kafka = createKafka();
  const admin = kafka.admin();

  await admin.connect()

  await admin.createTopics({
    topics: [
      {
        topic: getEnv('LOGS_TOPIC'),
        numPartitions: 3
      },
      {
        topic: getEnv('COLORS_TOPIC'),
        numPartitions: 5,
        replicationFactor: 2
      }
    ]
  })

  return admin.disconnect();
}
