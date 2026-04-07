import {
  ConcertDate,
  ConcertId,
  PersistedConcertDateProps,
} from '../../domain';
import { ConcertDateId } from '../../domain/model/concert.date.id.vo';
import { ConcertDateEntity } from '../entity';

export class ConcertDateMapper {
  static toDomain(entity: ConcertDateEntity): ConcertDate {
    if (!entity) return null;

    const props: PersistedConcertDateProps = {
      id: ConcertDateId.of(entity.id),
      date: entity.date,
      ticketOpenDate: entity.ticketOpenDate,
      totalSeats: entity.totalSeats,
      concertId: ConcertId.of(entity.concertId),
    };

    return ConcertDate.reconstitute(props);
  }

  static toEntity(domain: ConcertDate): ConcertDateEntity {
    if (!domain) return null;

    const entity = new ConcertDateEntity();

    if (domain.hasId()) entity.id = domain.id.getValue();

    entity.date = domain.date;
    entity.ticketOpenDate = domain.ticketOpenDate;
    entity.totalSeats = domain.totalSeats;
    entity.concertId = domain.concertId.getValue();
    return entity;
  }
}
