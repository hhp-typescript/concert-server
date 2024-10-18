import { Payment } from '../model/payment';

export interface IPaymentRepository {
  savePayment(payment: Payment): Promise<Payment>;
}
