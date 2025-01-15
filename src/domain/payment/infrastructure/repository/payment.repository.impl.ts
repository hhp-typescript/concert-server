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
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(PaymentEntity, manager);
  }

  async savePayment(payment: Payment): Promise<Payment> {
    const entity = PaymentMapper.toEntity(payment);
    const savedEntity = await this.manager.save(PaymentEntity, entity);
    return PaymentMapper.toDomain(savedEntity);
  }
}
