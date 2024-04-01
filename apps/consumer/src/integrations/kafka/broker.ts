import {
  Consumer,
  ConsumerSubscribeTopics,
  EachBatchPayload,
  Kafka,
  Batch,
  EachMessageHandler
} from 'kafkajs'
import getEnv from '../../helpers/env';

export default class TopicConsumer {
  private kafkaConsumer: Consumer;

  public constructor() {
    this.kafkaConsumer = this.createKafkaConsumer()
  }

  public async startConsumer(topicName: string, handler: EachMessageHandler): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: [topicName],
      fromBeginning: false
    }

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);

      await this.kafkaConsumer.run({
        eachMessage: handler
      });
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  public async startBatchConsumer(topicName: string, handler: (batch: Batch) => Promise<void>): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: [topicName],
      fromBeginning: false
    }

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);
      await this.kafkaConsumer.run({
        eachBatch: async (eachBatchPayload: EachBatchPayload) => {
          const { batch } = eachBatchPayload;
          await handler(batch);
        }
      })
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect()
  }

  private createKafkaConsumer(): Consumer {
    const kafka = new Kafka({
      clientId: getEnv('CONSUMER_APP_ID'),
      brokers: getEnv('KAFKA_BROKERS').split(/\s*,\s*/).filter(Boolean),
    });
    const consumer = kafka.consumer({ groupId: getEnv('CONSUMER_GROUP_ID') });
    return consumer;
  }
}
