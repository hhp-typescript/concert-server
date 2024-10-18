import { Point } from '../../domain/model/point';
import { PointEntity } from '../entity/point.typeorm.entity';

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
