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
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: IPaymentRepository,
    @Inject(PAYMENT_PRODUCER)
    private readonly paymentProducer: IPaymentProducer,
  ) {}

  async createPayment(reservationId: number, userId: number, price: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const txPaymentRepo = this.paymentRepo.createTransactionRepo(
        queryRunner.manager,
      );

      const savedPayment = await txPaymentRepo.savePayment(
        reservationId,
        userId,
        price,
        PaymentStatus.COMPLETED,
      );

      const eventType = 'PAYMENT_COMPLETED';

      const transactionId = uuidv4();
      const payload = {
        reservationId,
        userId,
        price,
        paymentId: savedPayment.id,
        transactionId,
        eventTime: new Date().toISOString(),
      };

      txPaymentRepo.saveOutbox(eventType, payload);
      await queryRunner.commitTransaction();

      this.paymentProducer.publishEvent(eventType, [
        { value: JSON.stringify(payload) },
      ]);

      return savedPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOutboxStatus(transactionId: string, status: OutboxStatus) {
    return await this.paymentRepo.updateOutboxStatus(transactionId, status);
  }

  async failPayment(transactionId: string) {
    const outbox =
      await this.paymentRepo.findOutboxByTransactionId(transactionId);

    if (!outbox) {
      throw new Error('Payment outbox not found');
    }

    const {
      payload: { paymentId },
    } = outbox;

    await this.paymentRepo.updatePaymentStatus(paymentId, PaymentStatus.FAILED);
  }
}
