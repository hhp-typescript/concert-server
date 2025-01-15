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
              offset: (parseInt(message.offset, 10) + 1).toString(),
            },
          ]);
        } catch (error) {
          this.logger.error(
            `Error processing message: ${error.message}`,
            error.stack,
          );
        }
      },
    });
  }
}
// import { Logger, OnModuleInit } from '@nestjs/common';
// import { Kafka, Consumer, EachMessagePayload, Producer } from 'kafkajs';
// import { kafkaConfig } from './kafka.config';

// export abstract class BaseKafkaConsumer implements OnModuleInit {
//   private readonly logger = new Logger(BaseKafkaConsumer.name);

//   protected kafka: Kafka;
//   protected consumer: Consumer;
//   protected producer: Producer;
//   protected groupId: string;
//   protected topic: string;
//   protected deadLetterTopic: string;
//   protected maxRetries: number = 3;

//   protected abstract handleMessage(payload: EachMessagePayload): Promise<void>;

//   protected initialize(groupId: string, topic: string) {
//     this.groupId = groupId;
//     this.topic = topic;
//     this.deadLetterTopic = `${topic}.deadletter`;
//     this.kafka = new Kafka(kafkaConfig);
//     this.consumer = this.kafka.consumer({ groupId: this.groupId });
//     this.producer = this.kafka.producer();
//   }

//   async onModuleInit() {
//     await this.consumer.connect();
//     await this.producer.connect();
//     await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
//     await this.consumer.run({
//       eachMessage: async (payload) => {
//         const { topic, partition, message } = payload;

//         try {
//           await this.processMessageWithRetry(payload, 0);
//           await this.consumer.commitOffsets([
//             {
//               topic,
//               partition,
//               offset: (BigInt(message.offset) + BigInt(1)).toString(),
//             },
//           ]);
//         } catch (error) {
//           this.logger.error(
//             `Error processing message: ${error.message}`,
//             error.stack,
//           );
//           await this.sendToDeadLetterTopic(payload);
//         }
//       },
//     });
//   }

//   private async processMessageWithRetry(
//     payload: EachMessagePayload,
//     retryCount: number,
//   ) {
//     try {
//       await this.handleMessage(payload);
//     } catch (error) {
//       if (retryCount < this.maxRetries) {
//         this.logger.warn(
//           `Retrying message processing. Attempt ${retryCount + 1} of ${this.maxRetries}`,
//         );
//         await this.processMessageWithRetry(payload, retryCount + 1);
//       } else {
//         throw error;
//       }
//     }
//   }

//   private async sendToDeadLetterTopic(payload: EachMessagePayload) {
//     const { topic, partition, message } = payload;
//     await this.producer.send({
//       topic: this.deadLetterTopic,
//       messages: [
//         {
//           value: JSON.stringify({
//             originalTopic: topic,
//             originalPartition: partition,
//             originalOffset: message.offset,
//             originalTimestamp: message.timestamp,
//             originalValue: message.value?.toString(),
//             error: 'Failed to process after max retries',
//             timestamp: new Date().toISOString(),
//           }),
//         },
//       ],
//     });
//     this.logger.warn(
//       `Message sent to dead letter topic: ${this.deadLetterTopic}`,
//     );
//   }
// }
