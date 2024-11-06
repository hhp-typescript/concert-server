import { Seat } from '../model/seat';

export interface ISeatConcurrencyRepository {
  saveSeat(seat: Seat): Promise<Seat>;
  getSeatByIdWithLock(seatId: number): Promise<Seat | null>;
  getSeatByIdWithNoWaitLock(seatId: number): Promise<Seat | null>;
  getSeatById(seatId: number): Promise<Seat | null>;
  saveSeatWithOptimisticLock(seat: Seat): Promise<Seat>;
  saveSeatWithSpinLock(seat: Seat): Promise<Seat>;
  saveSeatWithSimpleLock(seat: Seat): Promise<Seat>;
}
