import { Payment } from '../../domain/model/payment';
import { PaymentEntity } from '../entity/payment.typeorm.entity';

export class PaymentMapper {
  static toDomain(entity: PaymentEntity): Payment {
    return new Payment({
      id: entity.id,
      reservationId: entity.reservationId,
      userId: entity.userId,
      amount: entity.amount,
    });
  }

  static toEntity(domain: Payment): PaymentEntity {
    const entity = new PaymentEntity();
    entity.reservationId = domain.reservationId;
    entity.userId = domain.userId;
    entity.amount = domain.amount;
    return entity;
  }
}
