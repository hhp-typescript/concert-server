import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/infrastructure';
import { EntityManager } from 'typeorm';
import { IPointConcurrencyRepository } from '../../domain';
import { Point } from '../../domain';
import { PointEntity } from '../entity';
import { PointMapper } from '../mapper';

@Injectable()
export class PointConcurrencyRepositoryImpl
  extends BaseRepository<PointEntity>
  implements IPointConcurrencyRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(PointEntity, manager);
  }

  async getPointByUserIdWithLock(userId: number): Promise<Point | null> {
    const entity = await this.manager
      .createQueryBuilder(PointEntity, 'point')
      .leftJoinAndSelect('point.user', 'user')
      .where('user.id =:userId', { userId })
      .setLock('pessimistic_write')
      .getOne();

    return PointMapper.toDomain(entity);
  }

  async savePoint(point: Point): Promise<Point> {
    const pointEntity = PointMapper.toEntity(point);
    const entity = await this.save(pointEntity);
    return PointMapper.toDomain(entity);
  }
}
