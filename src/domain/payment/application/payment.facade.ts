import { Injectable } from '@nestjs/common';
import { PaymentService } from '../domain/service/payment.service';
import { PointHistoryService } from 'src/domain/user/domain/service/point.history.service';
import { ReservationService } from 'src/domain/concert/domain/service/reservation.service';
import { UserService } from 'src/domain/user/domain/service/user.service';
import { Transactional } from 'src/common/lib/decorator/transaction.decorator';
import { InjectTransactionManager } from 'src/common/lib/decorator/inject.manager.decorator';
import { NotFoundException } from 'src/common/exception';
import { ReservationStatus } from 'src/domain/concert/domain/model/reservation';

@Injectable()
export class PaymentFacade {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
    private readonly pointHistoryService: PointHistoryService,
    private readonly reservationService: ReservationService,
  ) {}

  @Transactional()
  @InjectTransactionManager([
    'userService',
    'pointHistoryService',
    'reservationService',
  ])
  async payment(
    reservationId: number,
    userId: number,
    amount: number,
  ): Promise<void> {
    const reservation =
      await this.reservationService.getValidReservationById(reservationId);

    if (!reservation) {
      throw new NotFoundException('payment', '해당 예약을 찾을 수 없습니다.');
    }

    if (reservation.status === ReservationStatus.CONFIRMED) {
      throw new Error('이미 결제 완료된 예약입니다.');
    }

    reservation.confirm();

    const [payment, _] = await Promise.all([
      this.paymentService.payment(reservationId, userId, amount),
      this.pointHistoryService.logUsage(userId, amount),
      this.userService.usePoint(userId, amount),
      this.reservationService.updateReservationStatusWithOptimisticLock(
        reservation,
      ),
    ]);

    return payment;
  }
}
