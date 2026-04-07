import { PersistedSeatProps, Seat, SeatStatus } from '../../domain';
import { ConcertDateId } from '../../domain/model/concert.date.id.vo';
import { SeatId } from '../../domain/model/seat.id.vo';
import { SeatEntity } from '../entity';

export class SeatMapper {
  static toDomain(entity: SeatEntity): Seat {
    if (!entity) return null;

    const props: PersistedSeatProps = {
      id: SeatId.of(entity.id),
      seatNumber: entity.seatNumber,
      price: entity.price,
      status: entity.status as SeatStatus,
      concertDateId: ConcertDateId.of(entity.concertDateId),
      version: entity.version,
    };

    return Seat.reconstitute(props);
  }

  static toEntity(domain: Seat): SeatEntity {
    if (!domain) return null;

    const entity = new SeatEntity();

    if (domain.hasId()) entity.id = domain.id.getValue();
    entity.seatNumber = domain.seatNumber;
    entity.price = domain.price;
    entity.status = domain.status;
    entity.version = domain.version;
    entity.concertDateId = domain.concertDateId.getValue();

    return entity;
  }
}
