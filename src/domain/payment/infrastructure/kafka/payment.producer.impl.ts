import { Injectable } from '@nestjs/common';
import { BaseKafkaProducer } from 'src/common/infrastructure';
import { IPaymentProducer } from '../../domain';

@Injectable()
export class PaymentProducerImpl
  extends BaseKafkaProducer
  implements IPaymentProducer
{
  async publishEvent(topic: string, messages: []): Promise<void> {
    await this.sendMessage({ topic, messages });
  }
}
