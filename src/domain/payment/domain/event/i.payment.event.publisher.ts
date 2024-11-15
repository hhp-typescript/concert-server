export interface IPaymentEventPublisher {
  publishPaymentCompleted(
    reservationId: number,
    userId: number,
    amount: number,
  ): void;
}
