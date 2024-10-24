import { Point } from './point';

export class User {
  readonly id: number;
  readonly name: string;
  readonly point: Point;

  constructor(args: { id?: number; name: string; point?: Point }) {
    this.id = args.id;
    this.name = args.name;
    this.point = args.point;
  }
}
