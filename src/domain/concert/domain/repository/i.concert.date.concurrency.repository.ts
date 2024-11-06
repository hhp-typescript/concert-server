import { ConcertDate } from '../model/concert.date';

export interface IConcertDateConcurrencyRepository {
  saveConcertDate(concertDate: ConcertDate): Promise<ConcertDate | null>;
}
