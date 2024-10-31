import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  POINT_CONCURRENCY_REPOSITORY,
  POINT_HISTORY_CONCURRENCY_REPOSITORY,
} from 'src/common/const';
import { DataSource } from 'typeorm';

import { IPointConcurrencyRepository } from '../repository/i.point.concurrency.repository';
import { IPointHistoryConcurrencyRepository } from '../repository/i.point.history.concurrency.repository';
import { InjectTransactionManager } from 'src/common/lib/decorator/inject.manager.decorator';
import { Transactional } from 'src/common/lib/decorator/transaction.decorator';
import { NotFoundException } from 'src/common/exception';
import { PointHistory } from '../model/point.history';

@Injectable()
export class UserConcurrencyService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(POINT_CONCURRENCY_REPOSITORY)
    private readonly pointConcurrencyRepo: IPointConcurrencyRepository,
    @Inject(POINT_HISTORY_CONCURRENCY_REPOSITORY)
    private readonly pointHsitoryConcurrencyRepo: IPointHistoryConcurrencyRepository,
  ) {}

  @Transactional()
  @InjectTransactionManager([
    'pointConcurrencyRepo',
    'pointHsitoryConcurrencyRepo',
  ])
  async chargePointWithPessimistic(userId: number, amount: number) {
    const userPoint =
      await this.pointConcurrencyRepo.getPointByUserIdWithLock(userId);

    if (!userPoint) {
      throw new NotFoundException('user', '유저가 존재하지 않습니다.');
    }

    userPoint.charge(amount);

    const pointHistory = new PointHistory({ userId });

    pointHistory.logCharge(amount);

    const point = await this.pointConcurrencyRepo.savePoint(userPoint);
    await this.pointHsitoryConcurrencyRepo.LogHistory(pointHistory);

    return point;
  }
}
