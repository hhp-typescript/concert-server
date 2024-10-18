import { Point } from '../model/point';

export interface IPointRepository {
  savePoint(point: Point): Promise<Point>;
  getPointByUserId(userId: number): Promise<Point | null>;
}
