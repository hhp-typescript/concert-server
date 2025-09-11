import { Injectable, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  RESERVATION_REPOSITORY,
  RESERVATION_PRODUCER,
} from 'src/common/application';
import { Seat } from 'src/domain/concert/domain';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { IReservationProducer } from '../event';
import { Reservation, ReservationStatus, OutboxStatus } from '../model';
import { IReservationRepository } from '../repository';
import { NotFoundException } from 'src/common/domain';
@Injectable()
export class ReservationService {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepo: IReservationRepository,
    @Inject(RESERVATION_PRODUCER)
    private readonly reservationProducer: IReservationProducer,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createReservation(
    concertDateId: number,
    seatId: number,
    userId: number,
    transactionId: string,
  ) {
    try {
      const reservation = await this.reservationRepo.createReservation(
        concertDateId,
        seatId,
        userId,
      );

      return reservation;
    } catch (error) {
      const eventType = 'RESERVATION_FAILED';
      const payload = {
        transactionId,
        eventTime: new Date().toISOString(),
      };

      await this.reservationRepo.saveOutbox(eventType, payload);
      await this.reservationProducer.publishEvent(eventType, [
        { value: JSON.stringify(payload) },
      ]);
      throw error;
    }
  }

  async getReservationByUserId(userId: number) {
    const reservation =
      await this.reservationRepo.getReservationByUserId(userId);

    if (!reservation) throw new NotFoundException('reservation');

    return reservation;
  }

  async getValidReservationById(reservationId: number) {
    const reservation =
      await this.reservationRepo.getReservationById(reservationId);

    if (!reservation) throw new NotFoundException('reservation');

    reservation.validate();

    return reservation;
  }

  async updateReservation(reservation: Reservation) {
    await this.reservationRepo.saveReservation(reservation);
  }

  async updateReservationStatus(
    transactionId: string,
    reservationId: number,
    status: ReservationStatus,
  ): Promise<Reservation> {
    try {
      const reservation =
        await this.reservationRepo.getReservationById(reservationId);

      if (!reservation) throw new NotFoundException('reservation');

      return await this.reservationRepo.updateReservationStatusWithOptimisticLock(
        reservation,
        status,
      );
    } catch (error) {
      const eventType = 'RESERVATION_UPDATE_FAILED';

      const payload = {
        transactionId,
        eventTime: new Date().toISOString(),
      };

      await this.reservationRepo.saveOutbox(eventType, payload);
      this.reservationProducer.publishEvent(eventType, [
        { value: JSON.stringify(payload) },
      ]);

      throw error;
    }
  }

  async updateOutboxStatus(transactionId: string, status: OutboxStatus) {
    await this.reservationRepo.updateOutboxStatus(transactionId, status);
  }
}
