export class PaymentCompletedEvent {
  constructor(
    public readonly reservationId: number,
    public readonly userId: number,
    public readonly amount: number,
  ) {}
}
