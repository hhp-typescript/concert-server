import { Injectable } from '@nestjs/common';
import { OnEventSafe } from 'src/common/lib/decorator/on.event.safe.decorator';
import axios from 'axios';
import { PaymentCompletedEvent } from '../../domain/event/payment.completed.event';
import { IPaymentEventListener } from '../../domain/event/i.payment.event.listener';

@Injectable()
export class PaymentEventListener implements IPaymentEventListener {
  @OnEventSafe('payment.completed', { async: true })
  async handlePaymentCompleted(event: PaymentCompletedEvent): Promise<void> {
    // Mock  API
    const mockApiUrl = 'http://localhost:3000/payments/mock-api';
    await axios.post(mockApiUrl, {
      reservationId: event.reservationId,
      userId: event.userId,
      amount: event.amount,
    });
  }
}
