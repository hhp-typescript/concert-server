import { Point } from '../model';

export interface IPointConcurrencyRepository {
  getPointByUserIdWithLock(userId: number): Promise<Point | null>;
  savePoint(point: Point): Promise<Point>;
}
