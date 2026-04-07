import { Concert, ConcertId, PersistedConcertProps } from '../../domain';
import { ConcertEntity } from '../entity';

export class ConcertMapper {
  static toDomain(entity: ConcertEntity): Concert {
    if (!entity) return null;

    const props: PersistedConcertProps = {
      id: ConcertId.of(entity.id),
      name: entity.name,
      description: entity.description,
    };

    return Concert.reconstitute(props);
  }

  static toEntity(domain: Concert): ConcertEntity {
    if (!domain) return null;

    const entity = new ConcertEntity();

    if (domain.hasId()) entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.description = domain.description;

    return entity;
  }
}
