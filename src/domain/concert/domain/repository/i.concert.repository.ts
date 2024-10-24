import { Concert } from '../model/concert';

export interface IConcertRepository {
  getConcertByConcertDateId(
    concertDateId: number,
  ): Promise<Concert | undefined>;
  getConcertById(concertId: number): Promise<Concert | undefined>;
  saveConcert(concert: Concert): Promise<Concert>;
}
