import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { OutboxStatus } from 'src/common/domain';
import { BaseKafkaConsumer } from 'src/common/infrastructure';
import { ReservationService } from '../../domain';

@Injectable()
export class ReservationCompleteOutboxConsumer extends BaseKafkaConsumer {
  private static readonly TOPIC = 'RESERVATION_COMPLETED';

  constructor(private readonly reservationService: ReservationService) {
    super();
    this.initialize(
      'reservation-complete-outbox-consumer-group',
      ReservationCompleteOutboxConsumer.TOPIC,
    );
  }

  protected async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message } = payload;

    const event = JSON.parse(message.value.toString());

    const { transactionId } = event;

    this.reservationService.updateOutboxStatus(
      transactionId,
      OutboxStatus.SUCCESS,
    );
  }
}
