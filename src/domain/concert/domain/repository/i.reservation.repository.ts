import { Reservation } from '../model/reservation';

export interface IReservationRepository {
  createReservation(
    concertDateId: number,
    seatId: number,
    userId: number,
  ): Promise<Reservation>;

  saveReservation(reservation: Reservation): Promise<Reservation>;
  getExpiredReservations(): Promise<Reservation[]>;
  getReservationById(reservationId: number): Promise<Reservation>;
  saveReservations(reservation: Reservation[]): Promise<void>;
}
