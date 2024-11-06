import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repository/base.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IReservationConcurrencyRepository } from '../../domain/repository/i.reservation.concurrency.repository';
import { ReservationMapper } from '../mapper/reservation.mapper';
import { ReservationEntity } from '../entity/reservation.typeorm.entity';
import { Seat } from '../../domain/model/seat';

@Injectable()
export class ReservationConcurrencyRepositoryImpl
  extends BaseRepository<ReservationEntity>
  implements IReservationConcurrencyRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(ReservationEntity, manager);
  }

  async createReservation(concertDateId: number, seat: Seat, userId: number) {
    const reservation = this.create({
      userId,
      concertDateId,
      seatId: seat.id,
      price: seat.price,
      reservedAt: new Date(),
      expiresAt: new Date(new Date().getTime() + 5 * 60 * 1000),
    });
    const entity = await this.save(reservation);

    return ReservationMapper.toDomain(entity);
  }
}
