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
  imports: [
    ReservationModule,
    ConcertModule,
    WaitingQueueModule,
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([PaymentEntity, PaymentOutboxEntity]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentFacade,
    PaymentCompleteOutboxConsumer,
    PointUseFailConsumer,
    ReservationUpdateFailConsumer,
    { provide: PAYMENT_PRODUCER, useClass: PaymentProducerImpl },
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepositoryImpl },
    {
      provide: PAYMENT_OUTBOX_REPOSITORY,
      useClass: PaymentOutboxRepositoryImpl,
    },

    { provide: 'IPaymentListener', useClass: PaymentEventListener },
    { provide: 'IPaymentPublisher', useClass: PaymentEventPublisher },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
