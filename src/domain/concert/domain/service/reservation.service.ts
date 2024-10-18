import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IReservationRepository } from '../repository/i.reservation.repository';
import {
  CONCERT_REPOSITORY,
  RESERVATION_REPOSITORY,
  SEAT_REPOSITORY,
} from 'src/common/const';
import { ISeatRepository } from '../repository/i.seat.repository';
import { Transactional } from 'src/common/lib/decorator/transaction.decorator';
import { InjectTransactionManager } from 'src/common/lib/decorator/inject.manager.decorator';
import { IConcertDateRepository } from '../repository/i.concert.date.repository';
import { ConcertDate } from '../model/concert.date';
import { Reservation, ReservationStatus } from '../model/reservation';
import { Seat } from '../model/seat';

@Injectable()
export class ReservationService {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepo: IReservationRepository,
    @Inject(SEAT_REPOSITORY)
    private readonly seatRepo: ISeatRepository,
    @Inject(CONCERT_REPOSITORY)
    private readonly concertDateRepo: IConcertDateRepository,
  ) {}
  async getValidReservationById(reservationId: number) {
    const reservation =
      await this.reservationRepo.getReservationById(reservationId);

    if (!reservation) throw new Error('예약을 찾을 수 없습니다.');

    if (reservation.status !== ReservationStatus.TEMPORARY)
      throw new Error('유효하지 않은 예약입니다.');

    return reservation;
  }
  @InjectTransactionManager(['reservationRepo'])
  async updateReservation(reservation: Reservation) {
    await this.reservationRepo.saveReservation(reservation);
  }

  @Transactional()
  @InjectTransactionManager(['seatRepo', 'reservationRepo', 'concertDateRepo'])
  async reserveSeat(concertDateId: number, seatId: number, userId: number) {
    const seat = await this.seatRepo.getSeatById(seatId);

    if (!seat) {
      throw new NotFoundException('해당 좌석을 찾을 수 없습니다.');
    }

    seat.reserve();

    const [reservation, _] = await Promise.all([
      this.reservationRepo.createReservation(concertDateId, seatId, userId),
      this.seatRepo.saveSeat(seat),
      this.concertDateRepo.saveConcertDate(seat.concertDate),
    ]);

    return reservation;
  }

  @Transactional()
  @InjectTransactionManager(['seatRepo', 'concertDateRepo', 'reservationRepo'])
  async expireReservations() {
    const expiredReservations =
      await this.reservationRepo.getExpiredReservations();
    const seatIds = expiredReservations.map(
      (reservation) => reservation.seatId,
    );

    const seats: Seat[] = await this.seatRepo.getSeatsByIds(seatIds);

    const updatedReservations = [];
    const updatedSeats = [];
    let updatedConcertDate: ConcertDate | null = null;

    for (const reservation of expiredReservations) {
      reservation.status = ReservationStatus.EXPIRED;
      updatedReservations.push(reservation);

      const seat = seats.find((seat) => seat.id === reservation.seatId);

      seat.release();
      updatedSeats.push(seat);

      updatedConcertDate = seat.concertDate;
    }

    await Promise.all([
      this.reservationRepo.saveReservations(updatedReservations),
      this.seatRepo.saveSeats(updatedSeats),
      this.concertDateRepo.saveConcertDate(updatedConcertDate),
    ]);
  }
}
