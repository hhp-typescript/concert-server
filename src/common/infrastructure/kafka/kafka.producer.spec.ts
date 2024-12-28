import { Test, TestingModule } from '@nestjs/testing';
import { Kafka } from 'kafkajs';
import { ConfigModule } from '@nestjs/config';

import { KAFKA_CLIENT } from 'src/common/const';
import { BaseKafkaProducer } from './base.kafka.producer';
import { BaseKafkaConsumer } from './base.kafka.consumer';

describe('Kafka Integration Test', () => {
  let producer: BaseKafkaProducer;
  let consumer: BaseKafkaConsumer;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              ENV_KAFKA_CLIENT_ID_KEY: 'test-client',
              ENV_KAFKA_BROKERS_KEY:
                'localhost:19094,localhost:19095,localhost:19096',
            }),
          ],
        }),
      ],
      providers: [
        {
          provide: KAFKA_CLIENT,
          useFactory: () =>
            new Kafka({
              clientId: 'test-client',
              brokers: [
                'localhost:19094',
                'localhost:19095',
                'localhost:19096',
              ], // 브로커 주소 설정
            }),
        },
        {
          provide: 'TEST_PRODUCER',
          useFactory: (kafka: Kafka) =>
            new (class TestKafkaProducer extends BaseKafkaProducer {
              constructor() {
                super(kafka);
              }
            })(),
          inject: [KAFKA_CLIENT],
        },
        {
          provide: 'TEST_CONSUMER',
          useFactory: (kafka: Kafka) =>
            new (class TestKafkaConsumer extends BaseKafkaConsumer {
              constructor() {
                super(kafka, 'test-group-id'); // 그룹 ID 설정
              }
            })(),
          inject: [KAFKA_CLIENT],
        },
      ],
    }).compile();

    producer = module.get<BaseKafkaProducer>('TEST_PRODUCER');
    consumer = module.get<BaseKafkaConsumer>('TEST_CONSUMER');

    await producer.onModuleInit();
    await consumer.onModuleInit();
  });

  afterAll(async () => {
    if (producer) await producer.onModuleDestroy();
    if (consumer) await consumer.onModuleDestroy();
  });

  it('Kafka Producer and Consumer should communicate', async () => {
    const testTopic = 'test-topic';
    const testMessage = { message: 'Hello, Kafka!' };

    // Ensure the consumer subscribes to the topic
    await consumer.subscribe(testTopic);

    const messages: string[] = [];

    // Run the consumer
    await consumer.run(async ({ message }) => {
      messages.push(message.value.toString());
    });

    // Send a message
    await producer.sendMessage(testTopic, 'test-key', testMessage);

    // Wait for the message to be consumed
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(messages).toContain(JSON.stringify(testMessage));
  });
});
