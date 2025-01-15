import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PAYMENT_PRODUCER,
  PAYMENT_REPOSITORY,
  PAYMENT_OUTBOX_REPOSITORY,
} from 'src/common/application';
import { ConcertModule } from '../concert/concert.module';
import { ReservationModule } from '../reservation/reservation.module';
import { WaitingQueueModule } from '../waiting-queue/waiting.queue.module';
import {
  PaymentFacade,
  PaymentCompleteOutboxConsumer,
  PointUseFailConsumer,
  ReservationUpdateFailConsumer,
  PaymentEventListener,
  PaymentEventPublisher,
} from './application';
import { PaymentService } from './domain';
import {
  PaymentEntity,
  PaymentOutboxEntity,
  PaymentProducerImpl,
  PaymentRepositoryImpl,
  PaymentOutboxRepositoryImpl,
} from './infrastructure';
import { PaymentController } from './presentation';

@Module({
  imports: [UserModule, ConcertModule, WaitingQueueModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepositoryImpl },
  ],
})
export class PaymentModule {}
