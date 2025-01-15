import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { BaseKafkaConsumer } from 'src/common/infrastructure';
import { ConcertService } from '../../domain';

@Injectable()
export class ReservationCompleteConsumer extends BaseKafkaConsumer {
  private static readonly TOPIC = 'RESERVATION_COMPLETED';

  constructor(private readonly concertService: ConcertService) {
    super();
    this.initialize(
      'reservation-complete-consumer-group',
      ReservationCompleteConsumer.TOPIC,
    );
  }

  async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message } = payload;

    const event = JSON.parse(message.value.toString());

    const { seatId, transactionId } = event;

    await this.concertService.reserveSeat(transactionId, seatId);
  }
}
