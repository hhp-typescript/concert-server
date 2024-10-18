import { PointHistory } from '../model/point.history';

export interface IPointHistoryRepository {
  LogHistory(pointHistory: PointHistory): Promise<void>;
}
