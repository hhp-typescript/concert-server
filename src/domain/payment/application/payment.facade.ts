import { Inject, Injectable } from '@nestjs/common';
import { PaymentService } from '../domain/service/payment.service';
import { IPaymentEventPublisher } from '../domain/event/i.payment.event.publisher';
import { ReservationService } from 'src/domain/reservation/domain/service/reservation.service';
import { PAYMENT_PRODUCER } from 'src/common/application';

@Injectable()
export class PaymentFacade {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly reservationService: ReservationService,
    @Inject(PAYMENT_PRODUCER)
    private readonly paymentEventPublisher: IPaymentEventPublisher,
  ) {}

  async payment(reservationId: number, userId: number) {
    const reservation =
      await this.reservationService.getValidReservationById(reservationId);

    reservation.confirm();

    await this.paymentService.createPayment(
      reservationId,
      userId,
      reservation.price,
    );
  }
}
