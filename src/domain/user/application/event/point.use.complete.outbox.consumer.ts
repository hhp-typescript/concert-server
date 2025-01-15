import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { BaseKafkaConsumer } from 'src/common/infrastructure';
import { UserService, OutboxStatus } from '../../domain';

@Injectable()
export class PointUseCompleteOutBoxConsumer extends BaseKafkaConsumer {
  private static readonly TOPIC = 'POINT_USE_COMPLETED';

  constructor(private readonly userService: UserService) {
    super();
    this.initialize(
      'point-use-complete-outbox-consumer-group',
      PointUseCompleteOutBoxConsumer.TOPIC,
    );
  }

  protected async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message } = payload;

    const event = JSON.parse(message.value.toString());

    const { transactionId } = event;

    this.userService.updateOutboxStatus(transactionId, OutboxStatus.SUCCESS);
  }
}
