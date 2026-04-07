import { Payment, PersistedPaymentProps } from '../../domain';
import { PaymentId } from '../../domain/model/payment.id.vo';
import { ReservationId } from 'src/domain/reservation/domain/model/reservation.id.vo';
import { UserId } from 'src/domain/user/domain/model/user.id.vo';
import { PaymentEntity } from '../entity';

export class PaymentMapper {
  static toDomain(entity: PaymentEntity): Payment {
    if (!entity) return null;

    const props: PersistedPaymentProps = {
      id: PaymentId.of(entity.id),
      reservationId: ReservationId.of(entity.reservationId),
      userId: UserId.of(entity.userId),
      price: entity.price,
      status: entity.status,
    };

    return Payment.reconstitute(props);
  }

  static toEntity(domain: Payment): PaymentEntity {
    if (!domain) return null;

    const entity = new PaymentEntity();

    if (domain.hasId()) entity.id = domain.id.getValue();
    entity.reservationId = domain.reservationId.getValue();
    entity.userId = domain.userId.getValue();
    entity.price = domain.price;
    entity.status = domain.status;

    return entity;
  }
}
