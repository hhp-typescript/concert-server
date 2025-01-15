import { Seat } from '../../domain';
import { SeatEntity } from '../entity';
import { ConcertDateMapper } from './concert.date.mapper';

export class SeatMapper {
  static toDomain(entity: SeatEntity): Seat {
    return new Seat({
      id: entity.id,
      price: entity.price,
      concertDate: ConcertDateMapper.toDomain(entity.concertDate), // ConcertDateEntity -> ConcertDate 변환
      seatNumber: entity.seatNumber,
      isReserved: entity.isReserved,
    });
  }

  static toEntity(seat: Seat): SeatEntity {
    const entity = new SeatEntity();
    entity.id = seat.id;
    entity.price = seat.price;
    entity.concertDate = ConcertDateMapper.toEntity(seat.concertDate); // ConcertDate -> ConcertDateEntity 변환
    entity.isReserved = seat.isReserved;
    return entity;
  }
}
