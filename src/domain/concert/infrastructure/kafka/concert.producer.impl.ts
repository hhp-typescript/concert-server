import { Injectable } from '@nestjs/common';
import { BaseKafkaProducer } from 'src/common/infrastructure';
import { IConcertProducer } from '../../domain';

@Injectable()
export class ConcertProducerImpl
  extends BaseKafkaProducer
  implements IConcertProducer
{
  async publishEvent(topic: string, messages: []): Promise<void> {
    await this.sendMessage({ topic, messages });
  }
}
