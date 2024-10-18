import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { POINT_REPOSITORY, USER_REPOSITORY } from 'src/common/const';
import { DataSource } from 'typeorm';
import { User } from '../model/user';
import { IUserRepository } from '../repository/i.user.repository';
import { IPointRepository } from '../repository';
import { InjectTransactionManager } from 'src/common/lib/decorator/inject.manager.decorator';

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(POINT_REPOSITORY)
    private readonly pointRepo: IPointRepository,
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

    const point = await this.pointRepo.savePoint(userPoint);

    return point;
  }

  @InjectTransactionManager(['pointRepo'])
  async usePoint(userId: number, amount: number) {
    const userPoint = await this.pointRepo.getPointByUserId(userId);

    if (!userPoint) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    userPoint.use(amount);

    const point = await this.pointRepo.savePoint(userPoint);

    return point;
  }
}
