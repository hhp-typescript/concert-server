import { PointHistory } from '../model';

export interface IPointHistoryConcurrencyRepository {
  LogHistory(pointHistory: PointHistory): Promise<void>;
}
