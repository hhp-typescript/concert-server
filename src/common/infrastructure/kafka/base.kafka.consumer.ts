import { Logger, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { kafkaConfig } from './kafka.config';

export abstract class BaseKafkaConsumer implements OnModuleInit {
  private readonly logger = new Logger(BaseKafkaConsumer.name);

  protected kafka: Kafka;
  protected consumer: Consumer;
  protected groupId: string;
  protected topic: string;

  protected abstract handleMessage(payload: EachMessagePayload): Promise<void>;

  protected initialize(groupId: string, topic: string) {
    this.groupId = groupId;
    this.topic = topic;
    this.kafka = new Kafka(kafkaConfig);
    this.consumer = this.kafka.consumer({ groupId: this.groupId });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
    await this.consumer.run({
      eachMessage: async (payload) => {
        const { topic, partition, message } = payload;
        try {
          await this.handleMessage(payload);
          await this.consumer.commitOffsets([
            {
              topic,
              partition,
              offset: message.offset,
            },
          ]);
        } catch (error) {
          this.logger.error(
            `Error processing message: ${error.message}`,
            error.stack,
          );
          await this.consumer.commitOffsets([
            {
              topic,
              partition,
              offset: message.offset,
            },
          ]);
        }
      },
    });
  }
}
