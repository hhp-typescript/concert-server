# 대기열 시스템 설계 보고서

본 보고서는 콘서트 예매 시스템에서 Redis를 활용한 대기열 관리 시스템의 설계와 주요 기능을 설명합니다. Redis를 통해 대기열의 상태를 관리하고, 서비스 접근을 제한함으로써 대규모 트래픽을 효율적으로 제어하여 안정적인 시스템 운영을 목표로 합니다.

## 1. Redis 자료 구조를 활용한 대기열 관리

### 1.1 Waiting Token

- ZSET (정렬된 집합) 사용 목적: Waiting Tokens는 대기 중인 사용자를 관리하기 위한 자료 구조로, ZSET을 사용하여 사용자 요청이 들어온 순서대로 정렬된 대기열을 유지합니다.
- 구조: Key는 콘서트별 대기열 토큰(concert:${concertDateId}:waiting)이며, Score는 요청 시간(timestamp), Member에는 사용자 고유의 토큰이 저장됩니다.

- 주요 Redis 명령어
  - ZADD: 새로운 대기열 토큰을 추가할 때 사용하여, 요청 시간에 따라 정렬된 대기열을 구성합니다.
  - ZRANK: 특정 사용자의 대기 순번을 계산하여, 앞에 몇 명이 대기 중인지 확인합니다.
  - ZRANGE: 일정 수의 사용자를 대기열에서 추출하여 Active Tokens로 전환할 수 있습니다.

## 1.2 Active Tokens

- 대기열에서 활성화된 사용자 토큰을 관리하며, TTL을 통해 일정 시간 후 자동으로 만료되도록 합니다.

- 구조: Key는 활성화된 토큰(active:${concertDateId}:${token})이며, TTL을 설정하여 5분 후 자동 만료되도록 관리합니다.

- 주요 Redis 명령어:
  - SET: 활성화된 토큰을 추가하여 사용자에게 서비스 접근 권한을 부여합니다. TTL을 사용해 토큰 만료 시간을 설정하여 자동으로 만료될 수 있도록 합니다.
  - EXISTS: 특정 토큰이 활성 상태인지 확인하여 서비스 접근 여부를 검증합니다.
  - DEL: 필요 시 특정 활성화된 토큰을 삭제하여 접근 권한을 해제할 수 있습니다.

## 2. 대기열 시스템 처리 흐름

### 2.1 토큰 발급 및 대기열 등록

- 사용자가 콘서트 서비스에 접근하면 새로운 UUID 기반의 대기열 토큰을 생성하고, Waiting Tokens ZSET에 추가하여 대기열에 등록합니다.
- score는 요청 시간(timestamp)으로 설정하여, 대기열에서 사용자의 요청 순서를 관리합니다.

```typescript
async issueToken(concertDateId: number) {
    const token = uuidv4();
    const key = `concert:${concertDateId}:waiting`;
    const timestamp = Date.now();
    await this.redis.zadd(key, timestamp, token);
    return token;
}
```

### 2.2 대기열에서 활성화 상태로 전환

- 주기적으로 Waiting Tokens에서 일정 수의 사용자를 추출하여 Active Tokens로 전환합니다.
- ZRANGE 명령어로 일정 수의 대기 중인 사용자를 추출하고, SET 명령어를 사용해 개별 활성화 토큰을 발행하여 TTL을 5분으로 설정합니다.
- ZREM을 통해 대기열에서 해당 토큰들을 일괄 삭제하여, 중복 처리가 발생하지 않도록 합니다.

```typescript
async activateTokens(concertDateId: number, count: number): Promise<void> {
    const waitingKey = `concert:${concertDateId}:waiting`;
    const ttlInSeconds = 300; // 5분 (300초)

    const tokensToActivate = await this.redis.zrange(waitingKey, 0, count - 1);
    const pipeline = this.redis.pipeline();

    tokensToActivate.forEach((token) => {
      pipeline.set(`active:${concertDateId}:${token}`, '', 'EX', ttlInSeconds);
    });

    // waiting token 삭제
    pipeline.zrem(waitingKey, ...tokensToActivate);

    await pipeline.exec();
}
```

### 2.3 대기 순번 조회

- 사용자는 자신의 대기열 순번을 확인할 수 있습니다. ZRANK 명령어를 사용하여 대기열 내에서의 현재 순번을 조회할 수 있습니다.

```typescript
async getWaitingTokenRank(concertDateId: number, token: string): Promise<number | null> {
    const key = `concert:${concertDateId}:waiting`;
    const rank = await this.redis.zrank(key, token);
    return rank !== null ? rank + 1 : null;
}
```

### 2.4 활성 토큰 상태 확인 및 만료 처리

- isTokenActive 메서드를 통해 특정 사용자가 현재 서비스 접근 권한이 있는지 확인할 수 있습니다. EXISTS 명령어로 해당 토큰의 활성 상태를 검사합니다.
- 필요할 경우 DEL 명령어를 통해 특정 활성화된 토큰을 삭제할 수 있습니다.

```typescript

async isTokenActive(concertDateId: number, token: string): Promise<boolean> {
    const activeKey = `active:${concertDateId}:${token}`;
    const exists = await this.redis.exists(activeKey);
    return exists === 1;
}

async deleteToken(concertDateId: number, token: string): Promise<void> {
    const activeKey = `active:${concertDateId}:${token}`;
    await this.redis.del(activeKey);
}
```

## 3.결론

Redis 기반의 대기열 시스템을 통해 대규모 트래픽을 효율적으로 제어하며, 안정적인 서비스 접근을 가능하게 합니다. ZSET을 활용한 정렬된 대기열과 개별 활성화 토큰의 TTL 설정을 통해 자동으로 만료 처리를 수행하여 상태 관리를 단순화하였으며, 빠른 응답 속도와 데이터베이스 부하 감소의 이점을 제공합니다.

본 설계는 Redis의 자료 구조와 TTL을 효과적으로 활용하여 대기열을 관리하는 방식으로, 고빈도 요청이 예상되는 예매 서비스 환경에서 효율적인 트래픽 제어와 안정적인 운영을 지원할 수 있습니다.
