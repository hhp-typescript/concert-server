import { Point } from '../model/point';

export interface IPointConcurrencyRepository {
  getPointByUserIdWithLock(userId: number): Promise<Point | null>;
  savePoint(point: Point): Promise<Point>;
}
