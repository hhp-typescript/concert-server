export class Payment {
  id: number;
  reservationId: number;
  userId: number;
  amount: number;

  constructor(args: {
    id?: number;
    reservationId: number;
    userId: number;
    amount: number;
  }) {
    this.id = args.id;
    this.reservationId = args.reservationId;
    this.userId = args.userId;
    this.amount = args.amount;
  }
}
