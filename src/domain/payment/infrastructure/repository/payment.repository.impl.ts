import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repository/base-repository';
import { EntityManager } from 'typeorm';
import { IPaymentRepository } from '../../domain/repository/i.payment.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PaymentEntity } from '../entity/payment.typeorm.entity';
import { Payment } from '../../domain/model/payment';
import { PaymentMapper } from '../mapper/payment.mappter';

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
