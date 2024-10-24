export class Point {
  id: number;
  balance: number;

  constructor(args: { id?: number; balance: number }) {
    this.id = args.id;
    this.balance = args.balance;
  }
  getBalance(): number {
    return this.balance;
  }

  charge(amount: number): void {
    this.balance += amount;
  }

  use(amount: number): void {
    if (this.balance < amount) {
      throw new Error('잔액이 부족합니다.');
    }
    this.balance -= amount;
  }
}
