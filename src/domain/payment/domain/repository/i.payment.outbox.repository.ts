import { EntityManager } from 'typeorm';
import { PaymentOutbox, OutboxStatus } from '../model';

export interface IPaymentOutboxRepository {
  createTransactionRepo(manager: EntityManager): IPaymentOutboxRepository;
  saveOutbox(eventType: string, payload: Record<string, any>): Promise<void>;
  findPendingOutbox(): Promise<PaymentOutbox[] | []>;
  updateOutboxStatus(
    transactionId: string,
    status: OutboxStatus,
  ): Promise<void>;
}
