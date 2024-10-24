import { Injectable } from '@nestjs/common';
import { UserService } from '../domain/service/user.service';
import { Transactional } from 'src/common/lib/decorator/transaction.decorator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PointHistoryService } from '../domain/service/point.history.service';
import { InjectTransactionManager } from 'src/common/lib/decorator/inject.manager.decorator';

@Injectable()
export class UserFacade {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly pointHistoryService: PointHistoryService,
  ) {}

  async getPoint(userId: number) {
    return await this.userService.getUserById(userId);
  }

  @Transactional()
  @InjectTransactionManager(['userService', 'pointHistoryService'])
  async chargePoint(userId: number, amount: number) {
    const [point, _] = await Promise.all([
      await this.userService.chargePoint(userId, amount),
      await this.pointHistoryService.logCharge(userId, amount),
    ]);

    return point;
  }

  @Transactional()
  @InjectTransactionManager(['userService', 'pointHistoryService'])
  async usePoint(userId: number, amount: number) {
    const [point, _] = await Promise.all([
      await this.userService.usePoint(userId, amount),
      await this.pointHistoryService.logUsage(userId, amount),
    ]);

    return point;
  }
}
