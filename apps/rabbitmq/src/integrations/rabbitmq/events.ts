import EventEmitter from 'events';

const eventManager = new EventEmitter();
const RABBITMQ_PUBLISHING_EVENTS = 'rabbitmq-publishing-events';

export interface RabbitMqEventData<T = unknown> {
  xName?: string;
  routingKey?: string;
  message: T;
}

export const registerPublishers = (publisher: (data: RabbitMqEventData) => void) => {
  eventManager.on(RABBITMQ_PUBLISHING_EVENTS, (data: RabbitMqEventData) => {
    publisher(data);
  });
}

export const publishMessage = (data: RabbitMqEventData) => {
  eventManager.emit(RABBITMQ_PUBLISHING_EVENTS, data);
}
