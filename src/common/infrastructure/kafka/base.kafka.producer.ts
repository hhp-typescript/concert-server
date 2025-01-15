import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Partitioners, Producer, ProducerRecord } from 'kafkajs';
import { kafkaConfig } from './kafka.config';

export class BaseKafkaProducer implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private readonly producer: Producer;
  constructor() {
    this.kafka = new Kafka(kafkaConfig);
    this.producer = this.kafka.producer({
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
  async sendMessage(record: ProducerRecord) {
    await this.producer.send(record);
  }
}
