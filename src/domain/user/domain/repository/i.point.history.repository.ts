import { EntityManager } from 'typeorm';
import { PointHistory } from '../model';

export interface IPointHistoryRepository {
  LogHistory(pointHistory: PointHistory): Promise<void>;
}
