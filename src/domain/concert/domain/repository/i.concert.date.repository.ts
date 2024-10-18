import { ConcertDate } from '../model/concert.date';

export interface IConcertDateRepository {
  saveConcertDate(concertDate: ConcertDate);
}
