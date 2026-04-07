import { PersistedPointProps, Point } from '../../domain';
import { PointId } from '../../domain/model/point.id.vo';
import { UserId } from '../../domain/model/user.id.vo';
import { PointEntity } from '../entity';

export class PointMapper {
  static toDomain(entity: PointEntity): Point {
    if (!entity) return null;

    const props: PersistedPointProps = {
      id: PointId.of(entity.id),
      userId: UserId.of(entity.userId),
      balance: entity.balance,
    };

    return Point.reconstitute(props);
  }

  static toEntity(domain: Point): PointEntity {
    if (!domain) return null;

    const entity = new PointEntity();

    if (domain.hasId()) entity.id = domain.id.getValue();
    entity.userId = domain.userId.getValue();
    entity.balance = domain.balance;

    return entity;
  }
}
