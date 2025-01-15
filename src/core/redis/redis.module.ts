import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ENV_REDIS_HOST_KEY, ENV_REDIS_PORT_KEY } from '../const';
import { REDIS_CLIENT } from 'src/common/application';

@Global()
@Module({
  imports: [ConfigModule],

  providers: [
    {
      inject: [ConfigService],
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>(ENV_REDIS_HOST_KEY),
          port: configService.get<number>(ENV_REDIS_PORT_KEY),
        });
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
