import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  WAITING_QUEUE_REPOSITORY,
  REDIS_QUEUE_REPOSITORY,
} from 'src/common/application';
import { WaitingQueueFacade } from './application';
import { WaitingQueueService } from './domain';
import {
  WaitingQueueEntity,
  WaitingQueueRepositoryImpl,
  RedisQueueRepositoryImpl,
} from './infrastucture';
import { WaitingQueueController, WaitingQueueScheduler } from './presentation';

@Module({
  imports: [TypeOrmModule.forFeature([WaitingQueueEntity])],
  controllers: [WaitingQueueController],
  providers: [
    WaitingQueueFacade,
    WaitingQueueService,
    WaitingQueueScheduler,
    { provide: WAITING_QUEUE_REPOSITORY, useClass: WaitingQueueRepositoryImpl },
    { provide: REDIS_QUEUE_REPOSITORY, useClass: RedisQueueRepositoryImpl },
  ],
  exports: [WaitingQueueService],
})
export class WaitingQueueModule {}
