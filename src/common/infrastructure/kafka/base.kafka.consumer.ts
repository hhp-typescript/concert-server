import { OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { KAFKA_CLIENT } from 'src/common/const';

export abstract class BaseKafkaConsumer
  implements OnModuleInit, OnModuleDestroy
{
  private readonly consumer: Consumer;

  constructor(
    @Inject(KAFKA_CLIENT) protected readonly kafka: Kafka,
    private readonly groupId: string,
  ) {
    this.consumer = kafka.consumer({ groupId });
  }

  // 초기화 시 Kafka Consumer 연결 및 구독
  async onModuleInit() {
    console.log(`Kafka Consumer [${this.groupId}]: Connecting...`);
    await this.consumer.connect();
    console.log(`Kafka Consumer [${this.groupId}]: Connected.`);
  }

  // 종료 시 Kafka Consumer 연결 해제
  async onModuleDestroy() {
    console.log(`Kafka Consumer [${this.groupId}]: Disconnecting...`);
    await this.consumer.disconnect();
    console.log(`Kafka Consumer [${this.groupId}]: Disconnected.`);
  }

  // 토픽 구독
  async subscribe(topic: string) {
    await this.consumer.subscribe({ topic, fromBeginning: true });
  }

  // 메시지 처리 핸들러
  async run(handler: (message: EachMessagePayload) => Promise<void>) {
    await this.consumer.run({
      eachMessage: async (payload) => {
        await handler(payload);
      },
    });
  }
}
