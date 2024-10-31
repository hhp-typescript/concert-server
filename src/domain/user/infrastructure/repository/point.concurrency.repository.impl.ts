import { BaseRepository } from 'src/common/repository/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IPointConcurrencyRepository } from '../../domain/repository/i.point.concurrency.repository';
import { PointMapper } from '../mapper/point.mapper';
import { PointEntity } from '../entity';
import { Point } from '../../domain/model/point';

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
