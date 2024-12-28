import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/infrastructure';
import { EntityManager } from 'typeorm';
import { IPointRepository, Point } from '../../domain';
import { PointEntity } from '../entity';
import { PointMapper } from '../mapper';

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
