import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  USER_REPOSITORY,
  POINT_HISTORY_REPOSITORY,
  POINT_REPOSITORY,
  POINT_PRODUCER,
  POINT_HISTORY_CONCURRENCY_REPOSITORY,
  POINT_CONCURRENCY_REPOSITORY,
} from 'src/common/application';
import {
  UserFacade,
  PointUseCompleteOutBoxConsumer,
  PointUseFailOutBoxConsumer,
  ReservationUpdateFailConsumer,
  PaymentCompleteConsumer,
  UserConcurrencyFacade,
} from './application';
import {
  UserService,
  PointHistoryService,
  UserConcurrencyService,
} from './domain';
import {
  UserEntity,
  PointEntity,
  PointHistoryEntity,
  UserOutboxEntity,
  UserRepositoryImpl,
  PointHistoryRepositoryImpl,
  PointRepositoryImpl,
  PointProducerImpl,
  PointHistoryConcurrencyRepositoryImpl,
  PointConcurrencyRepositoryImpl,
} from './infrastructure';
import { UserController } from './presentation';

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
