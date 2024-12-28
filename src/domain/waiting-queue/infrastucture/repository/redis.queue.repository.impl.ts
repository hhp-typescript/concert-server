import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/common/application';
import { v4 as uuidv4 } from 'uuid';
import { IRedisQueueRepository } from '../../domain';

@Injectable()
export class RedisQueueRepositoryImpl implements IRedisQueueRepository {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  // 대기열에 새로운 토큰 추가
  async issueToken(concertDateId: number) {
    const token = uuidv4();
    const key = `concert:${concertDateId}:waiting`;
    const timestamp = Date.now();
    await this.redis.zadd(key, timestamp, token);
    return token;
  }

  // 대기열에서 토큰 순번 조회
  async getWaitingTokenRank(
    concertDateId: number,
    token: string,
  ): Promise<number | null> {
    const key = `concert:${concertDateId}:waiting`;
    const rank = await this.redis.zrank(key, token);
    return rank !== null ? rank + 1 : null;
  }

  // 대기열에서 대기 중인 토큰 특정 수만큼의 토큰을 활성화 상태로 전환
  async activateTokens(concertDateId: number, count: number): Promise<void> {
    const waitingKey = `concert:${concertDateId}:tokens`;
    const ttlInSeconds = 300;

    const tokensToActivate = await this.redis.zrange(waitingKey, 0, count - 1);

    const pipeline = this.redis.pipeline();

    tokensToActivate.forEach((token) => {
      pipeline.set(`active:${concertDateId}:${token}`, '', 'EX', ttlInSeconds);
    });

    // waiting token 삭제
    pipeline.zrem(waitingKey, ...tokensToActivate);

    await pipeline.exec();
  }

  // active 상태의 토큰 조회
  async isTokenActive(concertDateId: number, token: string): Promise<boolean> {
    const activeKey = `active:${concertDateId}:${token}`;
    const exists = await this.redis.exists(activeKey);

    return exists === 1;
  }

  async deleteToken(concertDateId: number, token: string): Promise<void> {
    const activeKey = `active:${concertDateId}:${token}`;
    await this.redis.del(activeKey);
  }
}
