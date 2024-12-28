import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';
import { ENV_KAFKA_BROKERS_KEY, ENV_KAFKA_CLIENT_ID_KEY } from '../const';
import { KAFKA_CLIENT } from 'src/common/application';

@Global()
@Module({
  imports: [ConfigModule],

  providers: [
    {
      inject: [ConfigService],
      provide: KAFKA_CLIENT,
      useFactory: (configService: ConfigService) => {
        const clientId = configService.get<string>(ENV_KAFKA_CLIENT_ID_KEY);
        const brokers = configService
          .get<string>(ENV_KAFKA_BROKERS_KEY)
          ?.split(',');
        return new Kafka({ clientId, brokers });
      },
    },
  ],

  exports: [KAFKA_CLIENT],
})
export class KafkaModule {}
