// infra/concert/mapper/concert-date.mapper.ts
import { ConcertDate } from '../../domain/model/concert.date';
import { ConcertDateEntity } from '../entity/concert.date.typeorm.entity';
import { SeatMapper } from './seat.mapper'; // SeatMapper 경로 확인 및 수정

export class ConcertDateMapper {
  static toDomain(entity: ConcertDateEntity): ConcertDate {
    return new ConcertDate({
      id: entity.id,
      concertId: entity.concert.id, // concertId가 아닌 관계에서 가져와야 함
      date: entity.date,
      ticketOpenDate: entity.ticketOpenDate,
      totalSeats: entity.totalSeats,
      reservedSeats: entity.reservedSeats,
      seats: entity.seats.map(SeatMapper.toDomain),
    });
  }

  static toEntity(concertDate: ConcertDate): ConcertDateEntity {
    const entity = new ConcertDateEntity();
    entity.id = concertDate.id;
    entity.concert = { id: concertDate.concertId } as any; // concertId로 설정하려면 객체로 감싸서 설정
    entity.date = concertDate.date;
    entity.ticketOpenDate = concertDate.ticketOpenDate;
    entity.totalSeats = concertDate.totalSeats;
    entity.reservedSeats = concertDate.reservedSeats;
    entity.seats = concertDate.seats.map(SeatMapper.toEntity);
    return entity;
  }
}
