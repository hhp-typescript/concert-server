import { EntityManager } from 'typeorm';
import { PaymentStatus, Payment, PaymentOutbox, OutboxStatus } from '../model';

export interface IPaymentRepository {
  createTransactionRepo(manager: EntityManager): IPaymentRepository;
  savePayment(
    reservationId: number,
    userId: number,
    price: number,
    status: PaymentStatus,
  ): Promise<Payment>;
  saveOutbox(eventType: string, payload: Record<string, any>): Promise<void>;
  findPendingOutbox(): Promise<PaymentOutbox[] | []>;
  updateOutboxStatus(
    transactionId: string,
    status: OutboxStatus,
  ): Promise<void>;
  findOutboxByTransactionId(
    transactionId: string,
  ): Promise<PaymentOutbox | null>;
  updatePaymentStatus(paymentId: number, status: PaymentStatus): Promise<void>;
}
