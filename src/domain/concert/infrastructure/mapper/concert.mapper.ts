import { Concert } from '../../domain/model/concert';
import { ConcertEntity } from '../entity/concert.typeorm.entity';
import { ConcertDateMapper } from './concert.date.mapper';

export class ConcertMapper {
  static toDomain(entity: ConcertEntity): Concert {
    return new Concert({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      concertDates: entity.concertDates.map(ConcertDateMapper.toDomain),
    });
  }

  static toEntity(concert: Concert): ConcertEntity {
    const entity = new ConcertEntity();
    entity.id = concert.id;
    entity.name = concert.name;
    entity.description = concert.description;
    entity.concertDates = concert.concertDates.map(ConcertDateMapper.toEntity);
    return entity;
  }
}
