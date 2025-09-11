import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RESERVATION_REPOSITORY,
  RESERVATION_PRODUCER,
} from 'src/common/application';
import { ConcertModule } from '../concert/concert.module';
import {
  ReservationFacade,
  PointUseCompleteConsumer,
  ReservationUpdateFailOutboxConsumer,
  ReservationFailOutboxConsumer,
  SeatCompleteConsumer,
} from './application';
import { ReservationService } from './domain';
import {
  ReservationEntity,
  ReservationOutboxEntity,
  ReservationRepositoryImpl,
  ReservationProducerImpl,
} from './infrastructure';
import { ReservationController } from './presentation';

@Module({
  controllers: [ReservationController],
  imports: [
    ConcertModule,
    TypeOrmModule.forFeature([ReservationEntity, ReservationOutboxEntity]),
  ],
  providers: [
    ReservationFacade,
    ReservationService,
    PointUseCompleteConsumer,
    ReservationUpdateFailOutboxConsumer,
    ReservationFailOutboxConsumer,
    SeatCompleteConsumer,
    { provide: RESERVATION_REPOSITORY, useClass: ReservationRepositoryImpl },
    { provide: RESERVATION_PRODUCER, useClass: ReservationProducerImpl },
  ],
  exports: [ReservationService],
})
export class ReservationModule {}
