import { Reservation } from '../../domain/model/reservation';
import { ReservationEntity } from '../entity/reservation.typeorm.entity';

export class ReservationMapper {
  static toDomain(entity: ReservationEntity): Reservation {
    return new Reservation({
      id: entity.id,
      userId: entity.userId,
      seatId: entity.seatId,
      price: entity.price,
      concertDateId: entity.concertDateId,
      status: entity.status,
      reservedAt: entity.reservedAt,
      expiresAt: entity.expiresAt,
    });
  }

  static toEntity(reservation: Reservation): ReservationEntity {
    const entity = new ReservationEntity();
    entity.id = reservation.id;
    entity.userId = reservation.userId;
    entity.seatId = reservation.seatId;
    entity.price = reservation.price;
    entity.status = reservation.status;
    entity.reservedAt = reservation.reservedAt;
    entity.expiresAt = reservation.expiresAt;
    return entity;
  }
}
