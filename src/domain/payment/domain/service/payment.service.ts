import { PAYMENT_REPOSITORY } from 'src/common/const';
import { IPaymentRepository } from '../repository/i.payment.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Payment } from '../model/payment';
import { InjectTransactionManager } from 'src/common/lib/decorator/inject.manager.decorator';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: IPaymentRepository,
  ) {}

  @InjectTransactionManager(['paymentRepo'])
  async processPayment(
    reservationId: number,
    userId: number,
    amount: number,
  ): Promise<void> {
    const payment = new Payment({
      reservationId,
      userId,
      amount,
    });

    await this.paymentRepo.savePayment(payment);
  }
}
