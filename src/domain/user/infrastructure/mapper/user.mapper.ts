import { PersistedUserProps, User } from '../../domain';
import { UserId } from '../../domain/model/user.id.vo';
import { UserEntity } from '../entity';
import { PointMapper } from './point.mapper';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    if (!entity) return null;

    const props: PersistedUserProps = {
      id: UserId.of(entity.id),
      name: entity.name,
      point: entity.point ? PointMapper.toDomain(entity.point) : undefined,
    };

    return User.reconstitute(props);
  }

  static toEntity(domain: User): UserEntity {
    if (!domain) return null;

    const entity = new UserEntity();

    if (domain.hasId()) entity.id = domain.id.getValue();
    entity.name = domain.name;

    return entity;
  }
}
