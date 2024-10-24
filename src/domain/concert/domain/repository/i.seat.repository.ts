import { Seat } from '../model/seat';

export interface ISeatRepository {
  getSeatById(seatId: number): Promise<Seat | null>;
  saveSeat(seat: Seat): Promise<Seat | null>;
  getSeatsByIds(seatIds: number[]): Promise<Seat[] | []>;
  saveSeats(seats: Seat[]): Promise<void>;
}
