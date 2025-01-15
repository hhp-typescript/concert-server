import { EntityManager } from 'typeorm';
import { Concert, Seat, ConcertOutbox, OutboxStatus } from '../model';

export interface IConcertRepository {
  createTransactionRepo(manager: EntityManager): IConcertRepository;
  getConcertByConcertDateId(concertDateId: number): Promise<Concert | null>;
  getConcertById(concertId: number): Promise<Concert | null>;
  saveConcert(concert: Concert): Promise<Concert>;
  getAvailableSeatsByConcertDateId(concertDateId: number): Promise<Seat[] | []>;
  saveOutbox(eventType: string, payload: Record<string, any>): Promise<void>;
  findPendingOutbox(): Promise<ConcertOutbox[] | []>;
  updateOutboxStatus(
    transactionId: string,
    status: OutboxStatus,
  ): Promise<void>;
}
