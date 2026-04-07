import {
  PersistedReservationProps,
  Reservation,
  ReservationStatus,
} from '../../domain';
import { ReservationId } from '../../domain/model/reservation.id.vo';
import { ConcertDateId } from 'src/domain/concert/domain/model/concert.date.id.vo';
import { SeatId } from 'src/domain/concert/domain/model/seat.id.vo';
import { UserId } from 'src/domain/user/domain/model/user.id.vo';
import { ReservationEntity } from '../entity';

export class ReservationMapper {
  static toDomain(entity: ReservationEntity): Reservation {
    if (!entity) return null;

    const props: PersistedReservationProps = {
      id: ReservationId.of(entity.id),
      userId: UserId.of(entity.userId),
      seatId: SeatId.of(entity.seatId),
      concertDateId: ConcertDateId.of(entity.concertDateId),
      price: entity.price,
      status: entity.status as ReservationStatus,
      reservedAt: entity.reservedAt,
      expiresAt: entity.expiresAt,
      version: entity.version,
    };

    return Reservation.reconstitute(props);
  }

  static toEntity(domain: Reservation): ReservationEntity {
    if (!domain) return null;

    const entity = new ReservationEntity();

    if (domain.hasId()) entity.id = domain.id.getValue();
    entity.userId = domain.userId.getValue();
    entity.seatId = domain.seatId.getValue();
    entity.concertDateId = domain.concertDateId.getValue();
    entity.price = domain.price;
    entity.status = domain.status;
    entity.reservedAt = domain.reservedAt;
    entity.expiresAt = domain.expiresAt;
    entity.version = domain.version;

    return entity;
  }
}
