import { PointHistory, pointHistoryProps } from '../../domain';
import { PointHistoryEntity } from '../entity';

export class PointHistoryMapper {
  static toDomain(entity: PointHistoryEntity) {
    if (!entity) return null;

    const props: pointHistoryProps = {
      ...entity,
    };

    return new PointHistory(props);
  }

  static toEntity(domain: PointHistory): PointHistoryEntity {
    const props: pointHistoryProps = {
      id: domain.id,
      userId: domain.userId,
      amount: domain.amount,
      type: domain.type,
    };

    return Object.assign(new PointHistoryEntity(), props);
  }
}
