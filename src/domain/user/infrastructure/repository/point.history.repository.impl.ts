import { BaseRepository } from 'src/common/repository/base-repository';
import { PointHistoryEntity } from '../entity';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IPointHistoryRepository } from '../../domain/repository';
import { PointHistory } from '../../domain/model/point.history';
import { PointHistoryMapper } from '../mapper/point.history.mapper';

@Injectable()
export class PointHistoryRepositoryImpl
  extends BaseRepository<PointHistoryEntity>
  implements IPointHistoryRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(PointHistoryEntity, manager);
  }

  async LogHistory(pointHistory: PointHistory): Promise<void> {
    const HistoryEntity = PointHistoryMapper.toEntity(pointHistory);

    const entity = await this.save(HistoryEntity);

    PointHistoryMapper.toDomain(entity);
  }
}
