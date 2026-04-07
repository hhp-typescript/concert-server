import { PointId } from './point.id.vo';
import { UserId } from './user.id.vo';

export type NewPointProps = {
  userId: UserId;
  balance: number;
};

export type PersistedPointProps = {
  id: PointId;
  userId: UserId;
  balance: number;
};

export type PointProps = NewPointProps | PersistedPointProps;

export class Point {
  private constructor(private props: PointProps) {}

  static createNew(props: NewPointProps): Point {
    return new Point(props);
  }

  static reconstitute(props: PersistedPointProps): Point {
    return new Point(props);
  }

  hasId(): boolean {
    return 'id' in this.props;
  }

  get id(): PointId {
    if (!('id' in this.props)) throw new Error('id가 없는 Point');
    return this.props.id;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  charge(amount: number): void {
    this.props.balance += amount;
  }

  use(amount: number): void {
    if (this.props.balance < amount) {
      throw new Error('잔액이 부족합니다.');
    }
    this.props.balance -= amount;
  }

  get balance(): number {
    return this.props.balance;
  }
}
