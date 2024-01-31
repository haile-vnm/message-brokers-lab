import EventEmitter from 'events';

const eventManager = new EventEmitter();
const RABBITMQ_PUBLISHING_EVENTS = 'rabbitmq-publishing-events';

export interface RabbitMqEventData {
  xName?: string;
  routingKey?: string;
  message: Record<string, unknown>;
}

export const listenPublishers = (publisher: (data: RabbitMqEventData) => void) => {
  eventManager.on(RABBITMQ_PUBLISHING_EVENTS, (data: RabbitMqEventData) => {
    publisher(data);
  });
}

export const publishMessage = (data: Record<string, unknown>) => {
  eventManager.emit(RABBITMQ_PUBLISHING_EVENTS, data);
}
