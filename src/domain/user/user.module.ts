import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PointEntity,
  PointHistoryEntity,
  UserEntity,
} from './infrastructure/entity';
import { UserController } from './presentation/user.controller';
import { UserService } from './domain/service/user.service';
import { PointRepositoryImpl } from './infrastructure/repository/point.repository.impl';
import { PointHistoryRepositoryImpl } from './infrastructure/repository/point.history.repository.impl';
import {
  POINT_HISTORY_REPOSITORY,
  POINT_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/const';
import { PointHistoryService } from './domain/service/point.history.service';
import { UserFacade } from './application/user.facade';
import { UserRepositoryImpl } from './infrastructure/repository/user.repository.impl';

@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([UserEntity, PointEntity, PointHistoryEntity]),
  ],
  providers: [
    UserFacade,
    UserService,
    PointHistoryService,
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: POINT_HISTORY_REPOSITORY, useClass: PointHistoryRepositoryImpl },
    { provide: POINT_REPOSITORY, useClass: PointRepositoryImpl },
  ],
  exports: [PointHistoryService, UserService],
})
export class UserModule {}
