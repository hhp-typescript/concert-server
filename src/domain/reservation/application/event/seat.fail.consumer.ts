import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { BaseKafkaConsumer } from 'src/common/infrastructure';
import { ReservationService } from '../../domain';

@Injectable()
export class SeatFailConsumer extends BaseKafkaConsumer {
  private static readonly TOPIC = 'SEAT_FAILED';

  constructor(private readonly reservationService: ReservationService) {
    super();
    this.initialize('seat-fail-consumer-group', SeatFailConsumer.TOPIC);
  }

  protected async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message } = payload;

    const event = JSON.parse(message.value.toString());

    const { transactionId } = event;

    this.reservationService.failReservation(transactionId);
  }
}
