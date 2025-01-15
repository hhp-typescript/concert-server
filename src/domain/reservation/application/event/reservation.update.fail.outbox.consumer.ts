import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { OutboxStatus } from 'src/common/domain';
import { BaseKafkaConsumer } from 'src/common/infrastructure';
import { ReservationService } from '../../domain';

@Injectable()
export class ReservationUpdateFailOutboxConsumer extends BaseKafkaConsumer {
  private static readonly TOPIC = 'RESERVATION_UPDATE_FAILED';

  constructor(private readonly reservationService: ReservationService) {
    super();
    this.initialize(
      'reservation-update-fail-outbox-consumer-group',
      ReservationUpdateFailOutboxConsumer.TOPIC,
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
