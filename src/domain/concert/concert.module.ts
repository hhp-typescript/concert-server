import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CONCERT_PRODUCER,
  CONCERT_REPOSITORY,
  CONCERT_DATE_REPOSITORY,
  SEAT_REPOSITORY,
  CONCERT_CONCURRENCY_REPOSITORY,
  SEAT_CONCURRENCY_REPOSITORY,
} from 'src/common/application';
import {
  ConcertFacade,
  ReservationCompleteConsumer,
  SeatFailOutboxConsumer,
  ConcertConcurrencyFacade,
} from './application';
import { ConcertService, ConcertConcurrencyService } from './domain';
import {
  ConcertEntity,
  ConcertOutboxEntity,
  ConcertDateEntity,
  SeatEntity,
  ConcertProducerImpl,
  ConcertRepositoryImpl,
  ConcertDateRepositoryImpl,
  SeatRepositoryImpl,
  ConcertDateConcurrencyRepositoryImpl,
  SeatConcurrencyRepositoryImpl,
} from './infrastructure';
import { ConcertController } from './presentation';

@Module({
  controllers: [ConcertController],
  imports: [
    TypeOrmModule.forFeature([
      ConcertEntity,
      ConcertOutboxEntity,
      ConcertDateEntity,
      SeatEntity,
    ]),
  ],
  providers: [
    ConcertFacade,
    ConcertService,
    ReservationCompleteConsumer,
    SeatFailOutboxConsumer,

    { provide: CONCERT_PRODUCER, useClass: ConcertProducerImpl },
    { provide: CONCERT_REPOSITORY, useClass: ConcertRepositoryImpl },
    { provide: CONCERT_DATE_REPOSITORY, useClass: ConcertDateRepositoryImpl },
    { provide: SEAT_REPOSITORY, useClass: SeatRepositoryImpl },

    //동시성 테스트
    ConcertConcurrencyFacade,
    ConcertConcurrencyService,
    {
      provide: CONCERT_CONCURRENCY_REPOSITORY,
      useClass: ConcertDateConcurrencyRepositoryImpl,
    },
    {
      provide: SEAT_CONCURRENCY_REPOSITORY,
      useClass: SeatConcurrencyRepositoryImpl,
    },
  ],
  exports: [ConcertService],
})
export class ConcertModule {}
