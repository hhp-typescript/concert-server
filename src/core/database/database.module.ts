import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
  ENV_RUNTIME_KEY,
} from '../const';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>(ENV_DB_HOST_KEY),
          port: configService.get<number>(ENV_DB_PORT_KEY),
          username: configService.get<string>(ENV_DB_USERNAME_KEY),
          password: configService.get<string>(ENV_DB_PASSWORD_KEY),
          database: configService.get<string>(ENV_DB_DATABASE_KEY),
          autoLoadEntities: true,
          logging: true,
          extra: {
            connectionLimit: 25,
          },
          synchronize:
            configService.get<string>(ENV_RUNTIME_KEY) === 'development',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
