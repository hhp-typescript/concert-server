import { Message } from 'kafkajs';

export interface IPaymentProducer {
  publishEvent(topic: string, messages: Message[]): Promise<void>;
}
