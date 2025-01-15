import { ConcertDate } from '../model';

export interface IConcertDateRepository {
  saveConcertDate(concertDate: ConcertDate): Promise<ConcertDate | null>;
}
