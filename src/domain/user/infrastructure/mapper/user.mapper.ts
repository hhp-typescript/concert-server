import { User } from '../../domain';
import { UserEntity } from '../entity';
import { PointMapper } from './point.mapper';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      name: entity.name,
      point: entity.point ? PointMapper.toDomain(entity.point) : undefined,
    });
  }

  static toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.point = domain.point
      ? PointMapper.toEntity(domain.point)
      : undefined;
    return entity;
  }
}
