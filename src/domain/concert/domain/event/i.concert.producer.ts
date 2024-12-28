import { Message } from 'kafkajs';

export interface IConcertProducer {
  publishEvent(topic: string, messages: Message[]): Promise<void>;
}
