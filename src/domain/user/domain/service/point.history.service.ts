import { Injectable, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { POINT_HISTORY_REPOSITORY } from 'src/common/application';
import { InjectTransactionManager } from 'src/common/lib/decorator/inject.manager.decorator';
import { DataSource, EntityManager } from 'typeorm';
import { PointHistory } from '../model';
import { IPointHistoryRepository } from '../repository';

@Injectable()
export class PointHistoryService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(POINT_HISTORY_REPOSITORY)
    private readonly pointHistoryRepo: IPointHistoryRepository,
  ) {}

  @InjectTransactionManager(['pointHistoryRepo'])
  async logCharge(userId: number, amount: number) {
    const pointHistory = new PointHistory({ userId });

    pointHistory.logCharge(amount);

    await this.pointHistoryRepo.LogHistory(pointHistory);
  }

  @InjectTransactionManager(['pointHistoryRepo'])
  async logUsage(userId: number, amount: number) {
    const pointHistory = new PointHistory({ userId });

    pointHistory.logUsage(amount);

    await this.pointHistoryRepo.LogHistory(pointHistory);
  }
}
