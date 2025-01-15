import { Message } from 'kafkajs';

export interface IPointProducer {
  publishEvent(topic: string, messages: Message[]): Promise<void>;
}
