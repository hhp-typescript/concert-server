import { Message } from 'kafkajs';

export interface IReservationProducer {
  publishEvent(topic: string, messages: Message[]): Promise<void>;
}
