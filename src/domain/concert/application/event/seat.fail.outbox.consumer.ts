import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { OutboxStatus } from 'src/common/domain';
import { BaseKafkaConsumer } from 'src/common/infrastructure';
import { ConcertService } from '../../domain';

@Injectable()
export class SeatFailOutboxConsumer extends BaseKafkaConsumer {
  private static readonly TOPIC = 'SEAT_FAILED';

  constructor(private readonly concertService: ConcertService) {
    super();
    this.initialize(
      'seat-fail-outbox-consumer-group',
      SeatFailOutboxConsumer.TOPIC,
    );
  }

  protected async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message } = payload;

    const event = JSON.parse(message.value.toString());

    const { transactionId } = event;

    this.concertService.updateOutboxStatus(transactionId, OutboxStatus.SUCCESS);
  }
}
