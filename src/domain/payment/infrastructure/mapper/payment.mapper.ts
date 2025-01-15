import { Payment } from '../../domain';
import { PaymentEntity } from '../entity';

export class PaymentMapper {
  static toDomain(entity: PaymentEntity): Payment {
    if (!entity) return null;

    return new Payment({
      id: entity.id,
      reservationId: entity.reservationId,
      userId: entity.userId,
      price: entity.price,
      status: entity.status,
    });
  }

  static toEntity(domain: Payment): PaymentEntity {
    const entity = new PaymentEntity();
    entity.reservationId = domain.reservationId;
    entity.userId = domain.userId;
    entity.price = domain.price;
    entity.status = domain.status;
    return entity;
  }
}
