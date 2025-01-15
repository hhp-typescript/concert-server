import { Point } from '../../domain';
import { PointEntity } from '../entity';

export class PointMapper {
  static toDomain(entity: PointEntity): Point {
    const { id, balance } = entity;
    return new Point({ id, balance });
  }

  static toEntity(domain: Point): PointEntity {
    const entity = new PointEntity();
    entity.id = domain.id;
    entity.balance = domain.getBalance();
    return entity;
  }
}
