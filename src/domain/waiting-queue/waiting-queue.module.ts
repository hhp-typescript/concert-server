import { Module } from '@nestjs/common';
import { WAITING_QUEUE_REPOSITORY } from 'src/common/const';
import { WaitingQueueRepositoryImpl } from './infrastucture/repository/waiting.queue.repository.impl';
import { WaitingQueueService } from './domain/service/waiting.queue.service';
import { WaitingQueueController } from './presentation/waiting.queue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitingQueueEntity } from './infrastucture/entity/waiting.queue.typeorm.entity';
import { WaitingQueueFacade } from './application/waiting.queue.facade';

@Module({
  imports: [TypeOrmModule.forFeature([WaitingQueueEntity])],
  controllers: [WaitingQueueController],
  providers: [
    WaitingQueueFacade,
    WaitingQueueService,
    { provide: WAITING_QUEUE_REPOSITORY, useClass: WaitingQueueRepositoryImpl },
  ],
  exports: [WaitingQueueService],
})
export class WaitingQueueModule {}
