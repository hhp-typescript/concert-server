import { Injectable, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PAYMENT_REPOSITORY, PAYMENT_PRODUCER } from 'src/common/application';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { IPaymentProducer } from '../event';
import { PaymentStatus, OutboxStatus } from '../model';
import { IPaymentRepository } from '../repository';

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
