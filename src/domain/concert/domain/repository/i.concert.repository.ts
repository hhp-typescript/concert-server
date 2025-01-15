import { EntityManager } from 'typeorm';
import { Concert, Seat, ConcertOutbox, OutboxStatus } from '../model';

export interface IConcertRepository {
  getConcertByConcertDateId(
    concertDateId: number,
  ): Promise<Concert | undefined>;
  getConcertById(concertId: number): Promise<Concert | undefined>;
  saveConcert(concert: Concert): Promise<Concert>;
}
