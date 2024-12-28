import { Injectable, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  USER_REPOSITORY,
  POINT_REPOSITORY,
  POINT_HISTORY_REPOSITORY,
  POINT_PRODUCER,
} from 'src/common/application';
import { DataSource } from 'typeorm';
import { IPointProducer } from '../event';
import { User, PointHistory, OutboxStatus } from '../model';
import {
  IUserRepository,
  IPointRepository,
  IPointHistoryRepository,
} from '../repository';
import { NotFoundException } from 'src/common/domain';

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(POINT_REPOSITORY)
    private readonly pointRepo: IPointRepository,
    @Inject(POINT_HISTORY_REPOSITORY)
    private readonly pointHistoryRepo: IPointHistoryRepository,
    @Inject(POINT_PRODUCER)
    private readonly pointProducer: IPointProducer,
  ) {}

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepo.getUserById(userId);

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return user;
  }

  @InjectTransactionManager(['pointRepo'])
  async chargePoint(userId: number, amount: number) {
    const userPoint = await this.pointRepo.getPointByUserId(userId);

    if (!userPoint) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    userPoint.charge(amount);

      const pointHistory = new PointHistory({ userId });
      pointHistory.logCharge(amount);

      await txPointRepo.savePoint(userPoint);
      await txPointHistoryRepo.LogHistory(pointHistory);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async usePoint(
    userId: number,
    amount: number,
    transactionId: string,
    reservationId: number,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const txPointRepo = this.pointRepo.createTransactionRepo(
        queryRunner.manager,
      );
      const txPointHistoryRepo = this.pointHistoryRepo.createTransactionRepo(
        queryRunner.manager,
      );
      const txUserRepo = this.userRepo.createTransactionRepo(
        queryRunner.manager,
      );

      const userPoint = await txPointRepo.getPointByUserIdWithLock(userId);
    if (!userPoint) {
        throw new NotFoundException('user');
    }

    userPoint.use(amount);

      const pointHistory = new PointHistory({ userId });
      pointHistory.logUsage(amount);

      await txPointRepo.savePoint(userPoint);
      await txPointHistoryRepo.LogHistory(pointHistory);

      const eventType = 'POINT_USE_COMPLETED';

      const payload = {
        userId,
        amount,
        transactionId,
        reservationId,
        eventTime: new Date().toISOString(),
      };

      txUserRepo.saveOutbox(eventType, payload);

      this.pointProducer.publishEvent(eventType, [
        { value: JSON.stringify(payload) },
      ]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const eventType = 'POINT_USE_FAILED';

      const payload = {
        transactionId,
        eventTime: new Date().toISOString(),
      };

      await this.userRepo.saveOutbox(eventType, payload);

      this.pointProducer.publishEvent(eventType, [
        { value: JSON.stringify(payload) },
      ]);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOutboxStatus(
    transactionId: string,
    status: OutboxStatus,
  ): Promise<void> {
    return await this.userRepo.updateOutboxStatus(transactionId, status);
  }

  async rollbackPoint(transactionId: string): Promise<void> {
    const outbox = await this.userRepo.findOutboxByTransactionId(transactionId);

    if (!outbox) {
      throw new Error('User outbox not found');
    }

    const {
      payload: { userId, amount },
    } = outbox;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const txPointRepo = this.pointRepo.createTransactionRepo(
        queryRunner.manager,
      );
      const txPointHistoryRepo = this.pointHistoryRepo.createTransactionRepo(
        queryRunner.manager,
      );

      const userPoint = await txPointRepo.getPointByUserIdWithLock(userId);
      if (!userPoint) {
        throw new NotFoundException('user');
      }

      userPoint.charge(amount);

      const pointHistory = new PointHistory({ userId });
      pointHistory.logCharge(amount);

      await txPointRepo.savePoint(userPoint);
      await txPointHistoryRepo.LogHistory(pointHistory);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
