import { Test, TestingModule } from '@nestjs/testing';
import { BaseKafkaConsumer } from './base.kafka.consumer';
import { KAFKA_CLIENT } from 'src/common/const';
import { KafkaModule } from 'src/core/kafka/kafka.module';

class TestConsumer extends BaseKafkaConsumer {
  async handleMessage(payload: any) {
    console.log('Received message:', payload);
  }
}

describe('Kafka Consumer', () => {
  let consumer: TestConsumer;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [KafkaModule],
      providers: [
        {
          provide: TestConsumer,
          useFactory: (kafka) => new TestConsumer(kafka, 'test-group'),
          inject: [KAFKA_CLIENT],
        },
      ],
    }).compile();

    consumer = module.get<TestConsumer>(TestConsumer);
    await consumer.onModuleInit(); // Kafka Consumer 초기화
    await consumer.subscribe('test-topic'); // 토픽 구독
  });

  afterAll(async () => {
    await consumer.onModuleDestroy(); // Kafka Consumer 연결 종료
  });

  it('should consume a message from the topic', async () => {
    const handleMessageSpy = jest.spyOn(consumer, 'handleMessage');
    await consumer.run(async (message) => {
      const value = JSON.parse(message.message.value.toString());
      console.log('Consumed message:', value);

      expect(value).toMatchObject({ message: 'Hello Kafka' });
    });

    // handleMessage 메서드가 호출되었는지 확인
    expect(handleMessageSpy).toHaveBeenCalled();
  });
});
