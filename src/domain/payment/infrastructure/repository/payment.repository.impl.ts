import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { OutboxStatus } from 'src/common/domain';
import { BaseRepository } from 'src/common/infrastructure';
import { Repository, EntityManager } from 'typeorm';
import {
  IPaymentRepository,
  PaymentStatus,
  Payment,
  PaymentOutbox,
} from '../../domain';
import { PaymentEntity } from '../entity';
import { PaymentMapper } from '../mapper';
import { PaymentOutboxEntity } from '../outbox';

@Injectable()
export class PaymentRepositoryImpl
  extends BaseRepository<PaymentEntity>
  implements IPaymentRepository
{
  readonly outboxRepo: Repository<PaymentOutboxEntity>;

  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(PaymentEntity, manager);
    this.outboxRepo = manager.getRepository(PaymentOutboxEntity);
  }

  async savePayment(payment: Payment): Promise<Payment> {
    const entity = PaymentMapper.toEntity(payment);
    const savedEntity = await this.manager.save(PaymentEntity, entity);
    return PaymentMapper.toDomain(savedEntity);
  }

  async updatePaymentStatus(
    paymentId: number,
    status: PaymentStatus,
  ): Promise<void> {
    await this.manager.update(PaymentEntity, { id: paymentId }, { status });
  }

  async saveOutbox(
    eventType: string,
    payload: Record<string, any>,
  ): Promise<void> {
    const outbox = this.outboxRepo.create({
      eventType,
      payload,
      transactionId: payload.transactionId,
    });

    await this.outboxRepo.save(outbox);
  }

  async findPendingOutbox(): Promise<PaymentOutbox[] | []> {
    const entities = await this.manager
      .createQueryBuilder(PaymentOutboxEntity, 'paymentOutbox')
      .where('paymentOutbox.status = :status', { status: OutboxStatus.INIT })
      .getMany();

    return entities.map((entity) => new PaymentOutbox(entity));
  }

  async updateOutboxStatus(
    transactionId: string,
    status: OutboxStatus,
  ): Promise<void> {
    await this.manager.update(
      PaymentOutboxEntity,
      { transactionId },
      { status },
    );
  }

  async findOutboxByTransactionId(
    transactionId: string,
  ): Promise<PaymentOutbox | null> {
    const entity = await this.manager
      .createQueryBuilder(PaymentOutboxEntity, 'paymentOutbox')
      .where('paymentOutbox.transactionId = :transactionId', { transactionId })
      .getOne();

    return new PaymentOutbox(entity);
  }
}
