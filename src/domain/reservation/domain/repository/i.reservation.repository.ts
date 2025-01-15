import { Seat } from 'src/domain/concert/domain';
import { EntityManager } from 'typeorm';
import {
  Reservation,
  ReservationStatus,
  ReservationOutbox,
  OutboxStatus,
} from '../model';

export interface IReservationRepository {
  createTransactionRepo(manager: EntityManager): IReservationRepository;

  getReservationByUserId(userId: number): Promise<Reservation[]>;
  createReservation(
    concertDateId: number,
    seat: Seat,
    userId: number,
  ): Promise<Reservation>;
  saveReservation(reservation: Reservation): Promise<Reservation>;
  getExpiredReservations(): Promise<Reservation[]>;
  getReservationById(reservationId: number): Promise<Reservation>;
  saveReservations(reservation: Reservation[]): Promise<void>;
  updateReservationStatusWithOptimisticLock(
    reservation: Reservation,
    status: ReservationStatus,
  ): Promise<Reservation>;

  saveOutbox(eventType: string, payload: Record<string, any>): Promise<void>;
  findPendingOutbox(): Promise<ReservationOutbox[] | []>;
  updateOutboxStatus(
    transactionId: string,
    status: OutboxStatus,
  ): Promise<void>;
  findOutboxByTransactionId(
    transactionId: string,
  ): Promise<ReservationOutbox | null>;
  updateReservationStatus(
    rservationId: number,
    status: ReservationStatus,
  ): Promise<void>;
}
