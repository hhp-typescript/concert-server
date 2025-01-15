import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { BaseKafkaConsumer } from 'src/common/infrastructure';
import { UserService } from '../../domain';

@Injectable()
export class ReservationUpdateFailConsumer extends BaseKafkaConsumer {
  private static readonly TOPIC = 'RESERVATION_UPDATE_FAILED';

  constructor(private readonly userService: UserService) {
    super();
    this.initialize(
      'user-reservatrion-fail-consumer-group',
      ReservationUpdateFailConsumer.TOPIC,
    );
  }

  protected async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message } = payload;

    const event = JSON.parse(message.value.toString());

    const { transactionId } = event;

    await this.userService.rollbackPoint(transactionId);
  }
}
