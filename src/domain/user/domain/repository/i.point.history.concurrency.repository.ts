import { PointHistory } from '../model/point.history';

export interface IPointHistoryConcurrencyRepository {
  LogHistory(pointHistory: PointHistory): Promise<void>;
}
