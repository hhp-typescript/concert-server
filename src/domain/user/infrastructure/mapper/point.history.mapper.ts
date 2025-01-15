import { PointHistory } from '../../domain';
import { PointHistoryEntity } from '../entity';

export class PointHistoryMapper {
  static toDomain(entity: PointHistoryEntity) {
    const { id, userId, amount, type } = entity;
    return new PointHistory({ id, userId, amount, type });
  }

  static toEntity(domain: PointHistory): PointHistoryEntity {
    const entity = new PointHistoryEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.amount = domain.amount;
    entity.type = domain.type;
    return entity;
  }
}
