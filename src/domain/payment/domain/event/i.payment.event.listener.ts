import { PaymentCompletedEvent } from './payment.completed.event';

export interface IPaymentEventListener {
  handlePaymentCompleted(event: PaymentCompletedEvent): Promise<void>;
}
