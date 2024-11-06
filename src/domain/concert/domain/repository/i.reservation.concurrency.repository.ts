import { Reservation } from '../model/reservation';
import { Seat } from '../model/seat';

export interface IReservationConcurrencyRepository {
  createReservation(
    concertDateId: number,
    seat: Seat,
    userId: number,
  ): Promise<Reservation | null>;
}
