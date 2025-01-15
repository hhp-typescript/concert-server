import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/infrastructure';
import { EntityManager } from 'typeorm';
import { IPointHistoryConcurrencyRepository, PointHistory } from '../../domain';
import { PointHistoryEntity } from '../entity';
import { PointHistoryMapper } from '../mapper';

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
