import { OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { Kafka, Partitioners, Producer } from 'kafkajs';
import { KAFKA_CLIENT } from 'src/common/const';

export abstract class BaseKafkaProducer
  implements OnModuleInit, OnModuleDestroy
{
  private readonly producer: Producer;

  constructor(@Inject(KAFKA_CLIENT) protected readonly kafka: Kafka) {
    this.producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  // 초기화 시 Kafka Producer 연결
  async onModuleInit() {
    console.log('Kafka Producer: Connecting...');
    await this.producer.connect();
    console.log('Kafka Producer: Connected.');
  }

  // 종료 시 Kafka Producer 연결 해제
  async onModuleDestroy() {
    console.log('Kafka Producer: Disconnecting...');
    await this.producer.disconnect();
    console.log('Kafka Producer: Disconnected.');
  }

  // 메시지 전송
  async sendMessage(topic: string, key: string, value: any) {
    await this.producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(value) }],
    });
  }
}
