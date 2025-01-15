import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { BaseKafkaConsumer } from 'src/common/infrastructure';
import { UserService, OutboxStatus } from '../../domain';

@Injectable()
export class PointUseFailOutBoxConsumer extends BaseKafkaConsumer {
  private static readonly TOPIC = 'POINT_USE_FAILED';

  constructor(private readonly userService: UserService) {
    super();
    this.initialize(
      'point-use-fail-outbox-consumer-group',
      PointUseFailOutBoxConsumer.TOPIC,
    );
  }

  protected async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message } = payload;

    const event = JSON.parse(message.value.toString());

    const { transactionId } = event;

    await this.userService.updateOutboxStatus(
      transactionId,
      OutboxStatus.SUCCESS,
    );
  }
}
