import { Injectable } from '@nestjs/common';
import { BaseKafkaProducer } from 'src/common/infrastructure';
import { IReservationProducer } from '../../domain';

@Injectable()
export class ReservationProducerImpl
  extends BaseKafkaProducer
  implements IReservationProducer
{
  async publishEvent(topic: string, messages: []): Promise<void> {
    await this.sendMessage({ topic, messages });
  }
}
