import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { BaseKafkaConsumer } from 'src/common/infrastructure';
import { ReservationService, ReservationStatus } from '../../domain';

@Injectable()
export class PointUseCompleteConsumer extends BaseKafkaConsumer {
  private static readonly TOPIC = 'POINT_USE_COMPLETED';

  constructor(private readonly reservationService: ReservationService) {
    super();
    this.initialize(
      'point-use-complete-consumer-group',
      PointUseCompleteConsumer.TOPIC,
    );
  }

  protected async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message } = payload;

    const event = JSON.parse(message.value.toString());

    const { transactionId, reservationId } = event;

    this.reservationService.updateReservationStatus(
      transactionId,
      reservationId,
      ReservationStatus.CONFIRMED,
    );
  }
}
