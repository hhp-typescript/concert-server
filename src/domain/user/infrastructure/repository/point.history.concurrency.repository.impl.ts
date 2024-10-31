import { BaseRepository } from 'src/common/repository/base.repository';
import { PointHistoryEntity } from '../entity';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PointHistory } from '../../domain/model/point.history';
import { PointHistoryMapper } from '../mapper/point.history.mapper';
import { IPointHistoryConcurrencyRepository } from '../../domain/repository/i.point.history.concurrency.repository';

@Injectable()
export class PointHistoryConcurrencyRepositoryImpl
  extends BaseRepository<PointHistoryEntity>
  implements IPointHistoryConcurrencyRepository
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
