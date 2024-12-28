import { EntityManager } from 'typeorm';
import { PaymentStatus, Payment, PaymentOutbox, OutboxStatus } from '../model';

export interface IPaymentRepository {
  savePayment(payment: Payment): Promise<Payment>;
}
