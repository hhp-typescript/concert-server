import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { BaseKafkaConsumer } from 'src/common/infrastructure/kafka/base.kafka.consumer';
import { PaymentService } from '../../domain/service/payment.service';
import { OutboxStatus } from '../../domain/model/payment.outbox';

@Injectable()
export class PaymentCompleteOutboxConsumer extends BaseKafkaConsumer {
  private static readonly TOPIC = 'PAYMENT_COMPLETED';

  constructor(private readonly paymentService: PaymentService) {
    super();
    this.initialize(
      'payment-outbox-consumer-group',
      PaymentCompleteOutboxConsumer.TOPIC,
    );
  }

  protected async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;

    const event = JSON.parse(message.value.toString());
    console.log(event);
    const { transactionId } = event;
    this.paymentService.updateOutboxStatus(transactionId, OutboxStatus.SUCCESS);
  }
}
