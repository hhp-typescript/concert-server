import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { BaseKafkaConsumer } from 'src/common/infrastructure/kafka/base.kafka.consumer';
import { PaymentService } from '../../domain/service/payment.service';

@Injectable()
export class PointUseFailConsumer extends BaseKafkaConsumer {
  private static readonly TOPIC = 'POINT_USE_FAILED';

  constructor(private readonly paymentService: PaymentService) {
    super();
    this.initialize(
      'point-use-fail-consumer-group',
      PointUseFailConsumer.TOPIC,
    );
  }

  protected async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message } = payload;

    const event = JSON.parse(message.value.toString());

    const { transactionId } = event;

    this.paymentService.failPayment(transactionId);
  }
}
