import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { BaseKafkaConsumer } from 'src/common/infrastructure';
import { UserService } from '../../domain';

@Injectable()
export class PaymentCompleteConsumer extends BaseKafkaConsumer {
  private static readonly TOPIC = 'PAYMENT_COMPLETED';

  constructor(private readonly userService: UserService) {
    super();
    this.initialize('payment-consumer-group', PaymentCompleteConsumer.TOPIC);
  }

  protected async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;

    const event = JSON.parse(message.value.toString());
    const { userId, price, transactionId, reservationId } = event;

    await this.userService.usePoint(
      userId,
      price,
      transactionId,
      reservationId,
    );
  }
}
