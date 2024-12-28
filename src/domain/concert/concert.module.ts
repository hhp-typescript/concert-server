import { Module } from '@nestjs/common';
import { ConcertFacade } from './application/concert.facade';
import { ConcertService } from './domain/service/concert.service';
import { ConcertController } from './presentation/concert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertEntity } from './infrastructure/entity/concert.typeorm.entity';
import { ConcertDateEntity } from './infrastructure/entity/concert.date.typeorm.entity';
import { SeatEntity } from './infrastructure/entity/seat.typeorm.entity';

import {
  ConcertDateRepositoryImpl,
  ConcertRepositoryImpl,
  SeatRepositoryImpl,
} from './infrastructure/repository';
import { ConcertConcurrencyFacade } from './application/concert.concurrency.facade';
import { ConcertDateConcurrencyRepositoryImpl } from './infrastructure/repository/concert.date.concurrency.repository.impl';
import { SeatConcurrencyRepositoryImpl } from './infrastructure/repository/seat.concurrency.repository.impl';
import { ConcertConcurrencyService } from './domain/service/concert.concurrency.service';
import { ConcertOutboxEntity } from './infrastructure/entity/concert.outbox.entity';
import {
  ReservationCompleteConsumer,
  SeatFailOutboxConsumer,
} from './application/event';
import { ConcertProducerImpl } from './infrastructure/kafka/concert.producer.impl';
import {
  CONCERT_PRODUCER,
  CONCERT_REPOSITORY,
  CONCERT_DATE_REPOSITORY,
  SEAT_REPOSITORY,
  CONCERT_CONCURRENCY_REPOSITORY,
  SEAT_CONCURRENCY_REPOSITORY,
} from 'src/common/application';

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
