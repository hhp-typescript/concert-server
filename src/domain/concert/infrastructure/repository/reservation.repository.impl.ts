import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repository/base.repository';
import { ReservationEntity } from '../entity/reservation.typeorm.entity';
import { IReservationRepository } from '../../domain/repository/i.reservation.repository';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ReservationMapper } from '../mapper/reservation.mappter';
import { Reservation } from '../../domain/model/reservation';

@Injectable()
export class ReservationRepositoryImpl
  extends BaseRepository<ReservationEntity>
  implements IReservationRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(ReservationEntity, manager);
  }
  async getReservationById(reservationId: number): Promise<Reservation> {
    const entity = await this.findOneBy({ id: reservationId });
    return ReservationMapper.toDomain(entity);
  }

  async saveReservation(reservation: Reservation) {
    const reservationEntity = ReservationMapper.toEntity(reservation);
    const entity = await this.save(reservationEntity);
    return ReservationMapper.toDomain(entity);
  }

  async createReservation(
    concertDateId: number,
    seatId: number,
    userId: number,
  ) {
    const reservation = new ReservationEntity();
    reservation.userId = userId;
    reservation.concertDateId = concertDateId;
    reservation.seatId = seatId;
    reservation.reservedAt = new Date();
    reservation.expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);

    this.create(reservation);

    const entity = await this.save(reservation);

    return ReservationMapper.toDomain(entity);
  }

  async getExpiredReservations(): Promise<Reservation[]> {
    const now = new Date();
    const entities = await this.manager
      .createQueryBuilder(ReservationEntity, 'reservation')
      .where('reservation.expiresAt <= :now', { now })
      .andWhere('reservation.status = :status', { status: 'TEMPORARY' })
      .getMany();

    return entities.map((entity) => ReservationMapper.toDomain(entity));
  }

  async saveReservations(reservations: Reservation[]): Promise<void> {
    const reservationEntities = reservations.map((reservation) =>
      ReservationMapper.toEntity(reservation),
    );

    await this.save(reservationEntities);
  }

  async updateReservationStatusWithOptimisticLock(
    reservation: Reservation,
  ): Promise<Reservation> {
    const result = await this.manager
      .createQueryBuilder()
      .update(Reservation)
      .set({
        status: ReservationStatus.TEMPORARY,
        version: () => `${reservation.version} + 1`,
      })
      .where('id = :id', { id: reservation.id })
      .andWhere('version = :version', { version: reservation.version })
      .returning('*')
      .execute();

    if (result.affected === 0) {
      throw new Error('낙관적 락 충돌이 발생했습니다.');
    }

    return result.raw[0];
  }
}
