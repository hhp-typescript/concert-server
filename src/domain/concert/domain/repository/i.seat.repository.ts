import { EntityManager } from 'typeorm';
import { Seat } from '../model';

export interface ISeatRepository {
  getSeatById(seatId: number): Promise<Seat | null>;
  saveSeat(seat: Seat): Promise<Seat | null>;
  getSeatsByIds(seatIds: number[]): Promise<Seat[] | []>;
  saveSeats(seats: Seat[]): Promise<void>;
}
