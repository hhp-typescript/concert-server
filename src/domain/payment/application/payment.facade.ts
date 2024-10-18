import { Injectable } from '@nestjs/common';
import { PaymentService } from '../domain/service/payment.service';
import { PointHistoryService } from 'src/domain/user/domain/service/point.history.service';
import { ReservationService } from 'src/domain/concert/domain/service/reservation.service';
import { UserService } from 'src/domain/user/domain/service/user.service';
import { Transactional } from 'src/common/lib/decorator/transaction.decorator';
import { InjectTransactionManager } from 'src/common/lib/decorator/inject.manager.decorator';

@Injectable()
export class PaymentFacade {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
    private readonly pointHistoryService: PointHistoryService, // 포인트 관련 서비스
    private readonly reservationService: ReservationService, // 예약 관련 서비스
  ) {}

  @Transactional()
  @InjectTransactionManager([
    'userService',
    'pointHistoryService',
    'reservationService',
  ])
  // 결제 처리
  async processPayment(
    reservationId: number,
    userId: number,
    amount: number,
  ): Promise<void> {
    const reservation =
      await this.reservationService.getValidReservationById(reservationId);

    reservation.confirm();

    const [payment, _] = await Promise.all([
      this.paymentService.processPayment(reservationId, userId, amount),
      this.pointHistoryService.logUsage(userId, amount),
      this.userService.usePoint(userId, amount),
      this.reservationService.updateReservation(reservation),
    ]);

    return payment;
  }
}
