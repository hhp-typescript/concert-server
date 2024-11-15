import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentCompletedEvent } from '../../domain/event/payment.completed.event';
import { IPaymentEventPublisher } from '../../domain/event/i.payment.event.publisher';

@Injectable()
export class PaymentEventPublisher implements IPaymentEventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publishPaymentCompleted(
    reservationId: number,
    userId: number,
    amount: number,
  ): void {
    const event = new PaymentCompletedEvent(reservationId, userId, amount);
    this.eventEmitter.emit('payment.completed', event);
  }
}
