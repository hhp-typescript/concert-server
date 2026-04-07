export enum PointHistoryType {
  CHARGE = 'CHARGE',
  USE = 'USE',
}

export type pointHistoryProps = {
  id?: number;
  userId: number;
  amount: number;
  type: PointHistoryType;
};

export class PointHistory {
  constructor(private props: pointHistoryProps) {}

  static createPointHistory(
    userId: number,
    amount: number,
    type: PointHistoryType,
  ): PointHistory {
    return new PointHistory({ userId, amount, type });
  }

  get id(): number {
    return this.props.id;
  }

  get userId(): number {
    return this.props.userId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get type(): PointHistoryType {
    return this.props.type;
  }
}
