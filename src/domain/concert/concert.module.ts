import { Module } from '@nestjs/common';
import { ConcertController } from './presentation/concert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertEntity } from './infrastructure/entity/concert.typeorm.entity';
import { ConcertDateEntity } from './infrastructure/entity/concert.date.typeorm.entity';
import { ReservationEntity } from './infrastructure/entity/reservation.typeorm.entity';
import { SeatEntity } from './infrastructure/entity/seat.typeorm.entity';
import {
  CONCERT_DATE_REPOSITORY,
  CONCERT_REPOSITORY,
  RESERVATION_REPOSITORY,
  SEAT_REPOSITORY,
} from 'src/common/const';
import { ConcertRepositoryImpl } from './infrastructure/repository/concert.repository.impl';
import { ConcertService } from './domain/service/concert.service';
import { ReservationRepositoryImpl } from './infrastructure/repository/reservation.repository.impl';
import { SeatRepositoryImpl } from './infrastructure/repository/seat.repository.impl';
import { ConcertDateRepositoryImpl } from './infrastructure/repository';
import { ConcertFacade } from './application/concert.facade';
import { ReservationService } from './domain/service/reservation.service';

@Module({
  controllers: [ConcertController],
  imports: [
    TypeOrmModule.forFeature([
      ConcertEntity,
      ConcertDateEntity,
      ReservationEntity,
      SeatEntity,
    ]),
  ],
  providers: [
    ConcertFacade,
    ReservationService,
    ConcertService,
    { provide: CONCERT_REPOSITORY, useClass: ConcertRepositoryImpl },
    { provide: CONCERT_DATE_REPOSITORY, useClass: ConcertDateRepositoryImpl },
    { provide: RESERVATION_REPOSITORY, useClass: ReservationRepositoryImpl },
    { provide: SEAT_REPOSITORY, useClass: SeatRepositoryImpl },
  ],
  exports: [ConcertService, ReservationService],
})
export class ConcertModule {}
