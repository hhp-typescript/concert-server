import { BaseRepository } from 'src/common/repository/base-repository';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IPointRepository } from '../../domain/repository';
import { Point } from '../../domain/model/point';
import { PointEntity } from '../../infrastructure/entity';
import { PointMapper } from '../../infrastructure/mapper/point.mapper';

@Injectable()
export class PointRepositoryImpl
  extends BaseRepository<PointEntity>
  implements IPointRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(PointEntity, manager);
  }
  async getPointByUserId(userId: number): Promise<Point | undefined> {
    const entity = await this.findOne({
      where: { user: { id: userId } },
    });

    return PointMapper.toDomain(entity);
  }

  async savePoint(point: Point): Promise<Point> {
    const pointEntity = PointMapper.toEntity(point);
    const entity = await this.save(pointEntity);
    return PointMapper.toDomain(entity);
  }
}
