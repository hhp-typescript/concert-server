import { Inject, Injectable } from '@nestjs/common';
import { PaymentService } from '../domain/service/payment.service';
import { IPaymentEventPublisher } from '../domain/event/i.payment.event.publisher';
import { ReservationService } from 'src/domain/reservation/domain/service/reservation.service';

@Injectable()
export class PaymentFacade {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
    private readonly pointHistoryService: PointHistoryService,
    private readonly reservationService: ReservationService,
    @Inject('IPaymentPublisher')
    private readonly paymentEventPublisher: IPaymentEventPublisher,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async payment(reservationId: number, userId: number, amount: number) {
    const reservation =
      await this.reservationService.getValidReservationById(reservationId);

    if (!reservation) {
      throw new NotFoundException('payment', '해당 예약을 찾을 수 없습니다.');
    }

    if (reservation.status === ReservationStatus.CONFIRMED) {
      throw new ConflictException('payment', '이미 결제 완료된 예약입니다.');
    }

    reservation.confirm();

    const payment = await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const [payment, _] = await Promise.all([
          this.paymentService.payment(
            reservationId,
            userId,
            amount,
            entityManager,
          ),
          this.pointHistoryService.logUsage(userId, amount, entityManager),
          this.userService.usePoint(userId, amount, entityManager),
          this.reservationService.updateReservationStatusWithOptimisticLock(
            reservation,
            entityManager,
          ),
        ]);

        return payment;
      },
    );

    this.paymentEventPublisher.publishPaymentCompleted(
      reservationId,
      userId,
      amount,
    );

    return payment;
  }
}
