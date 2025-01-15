import { KafkaConfig } from 'kafkajs';
import * as dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

// Kafka 설정
export const kafkaConfig: KafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || 'my-kafka-client',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','), // 브로커 리스트
};
