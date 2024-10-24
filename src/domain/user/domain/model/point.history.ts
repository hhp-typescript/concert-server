export class PointHistory {
  id: number;
  userId: number;
  amount: number;
  type: PointHistoryType;

  constructor(args: {
    id?: number;
    userId: number;
    amount?: number;
    type?: PointHistoryType;
  }) {
    this.id = args.id;
    this.userId = args.userId;
    this.amount = args.amount;
    this.type = args.type;
  }

  logCharge(amount: number): void {
    this.amount = amount;
    this.type = PointHistoryType.CHARGE;
  }

  logUsage(amount: number): void {
    this.amount = amount;
    this.type = PointHistoryType.USE;
  }
}

export enum PointHistoryType {
  CHARGE = 'CHARGE',
  USE = 'USE',
}
