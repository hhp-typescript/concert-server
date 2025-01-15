import { EntityManager } from 'typeorm';
import { Point } from '../model';

export interface IPointRepository {
  savePoint(point: Point): Promise<Point>;
  getPointByUserId(userId: number): Promise<Point | null>;
}
