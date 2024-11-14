# 인덱스를 쿼리 최적화 보고서

각 쿼리의 현재 성능 상태를 분석하고, 다양한 인덱스 적용 전략을 통해 쿼리 성능을 향상시킨 과정을 상세히 설명한다. 단일 인덱스와 복합 인덱스의 사용을 비교하여, 각 전략의 쿼리 실행 계획 및 실제 성능 비교를 통해 최적화 결과를 확인하였다.

## 1. 쿼리 최적화 대상

1. **예약 내역 조회**

   - 예약 테이블의 총 데이터 수: 1000만 건
   - user_id로 예약 내역 조회하기

2. **예약 가능 좌석 조회**

   - 좌석 테이블의 총 데이터 수: 약 1000만 건
   - concert_date_id와 status로 예약 가능한 좌석 조회하기

## 2. 예약 내역 검색하기

### 1. repository 코드

```typescript
await this.manager
  .createQueryBuilder(ReservationEntity, 'reservation')
  .where('reservation.userId = :userId', { userId })
  .getMany();
```

### 2. 실제 실행 쿼리 밑 실행 계획

#### 1. 인덱스 적용 전

```sql
explain analyze SELECT "reservation"."id" AS "reservation_id", "reservation"."created_at" AS "reservation_created_at", "reservation"."updated_at" AS "reservation_updated_at", "reservation"."user_id" AS "reservation_user_id", "reservation"."concert_date_id" AS "reservation_concert_date_id", "reservation"."seat_id" AS "reservation_seat_id", "reservation"."status" AS "reservation_status", "reservation"."reserved_at" AS "reservation_reserved_at", "reservation"."expires_at" AS "reservation_expires_at", "reservation"."price" AS "reservation_price", "reservation"."version" AS "reservation_version" FROM "reservation_entity" "reservation" WHERE "reservation"."user_id" = 1;
```

```sql
                                                                    QUERY PLAN
--------------------------------------------------------------------------------------------------------------------------------------------------
 Gather  (cost=1000.00..319777.53 rows=102 width=60) (actual time=11.954..817.101 rows=48 loops=1)
   Workers Planned: 2
   Workers Launched: 2
   ->  Parallel Seq Scan on reservation_entity reservation  (cost=0.00..318767.33 rows=42 width=60) (actual time=39.917..716.732 rows=16 loops=3)
         Filter: (user_id = 1)
         Rows Removed by Filter: 3333317
 Planning Time: 0.116 ms
 JIT:
   Functions: 12
   Options: Inlining false, Optimization false, Expressions true, Deforming true
   Timing: Generation 8.442 ms, Inlining 0.000 ms, Optimization 3.391 ms, Emission 50.498 ms, Total 62.331 ms
 Execution Time: 817.807 ms
```

Parallel Seq Scan: Parallel Sequential Scan을 통해 테이블의 모든 행을 스캔(풀스캔)하고 user_id = 1 조건을 만족하는 행을 필터링 하고 있다.

#### 2. 인덱스 적용 후

단일 인덱스 user_id에 인덱스 적용

#### 인덱스 생성

```sql
CREATE INDEX idx_reservation_user_id ON reservation_entity (user_id);
```

user_id 컬럼에 인덱스를 생성하여 조회 성능을 개선

```sql

                                                             QUERY PLAN
--------------------------------------------------------------------------------------------------------------------------------------
Bitmap Heap Scan on reservation_entity reservation  (cost=5.23..408.52 rows=102 width=60) (actual time=0.032..0.099 rows=48 loops=1)
  Recheck Cond: (user_id = 1)
  Heap Blocks: exact=48
  ->  Bitmap Index Scan on idx_reservation_user_id  (cost=0.00..5.20 rows=102 width=0) (actual time=0.018..0.019 rows=48 loops=1)
        Index Cond: (user_id = 1)
Planning Time: 0.071 ms
Execution Time: 0.124 ms
```

Bitmap Index Scan + Bitmap Heap Scan: user_id 인덱스를 사용하여 효율적으로 필요한 행을 검색하므로 전체 테이블을 스캔하지 않고 조건에 맞는 데이터만 빠르게 조회.

### 3. 성능 비교 요약

| **인덱스 적용** | **Scan 전략**     | **쿼리 계획**    | **예상 비용 (cost)** | **실제 실행 시간 (초)** |
| --------------- | ----------------- | ---------------- | -------------------- | ----------------------- |
| 인덱스 적용 전  | Parallel Seq Scan | Sequential Scan  | 1000.00..319777.53   | 0.817 s                 |
| 인덱스 적용 후  | Bitmap Index Scan | Bitmap Heap Scan | 5.23..408.52         | 0.00012 s (0.12ms)      |

### 4. 결론

- `user_id`에 인덱스를 추가하여 쿼리 성능을 크게 향상.
- 인덱스를 사용한 쿼리는 테이블 풀 스캔을 방지하고, 필요한 데이터만을 빠르게 조회할 수 있도록 최적화.

## 2. 예약 가능 좌석 조회

### 1. Repository 코드

```typescript
await this.manager
  .createQueryBuilder(SeatEntity, 'seat')
  .where('seat.concert_date_id = :concertDateId', { concertDateId })
  .andWhere('seat.status = :status', { status: SeatStatus.UNRESERVED })
  .getMany();
```

### 2. 인덱스

1. 인덱스 적용 전

```sql
explain analyze SELECT
  "seat"."id" AS "seat_id",
  "seat"."created_at" AS "seat_created_at",
  "seat"."updated_at" AS "seat_updated_at",
  "seat"."seat_number" AS "seat_seat_number",
  "seat"."status" AS "seat_status",
  "seat"."price" AS "seat_price",
  "seat"."version" AS "seat_version",
  "seat"."concert_date_id" AS "seat_concert_date_id"
FROM
  "seat_entity" "seat"
WHERE
  "seat"."concert_date_id" = 1
  AND "seat"."status" = 'UNRESERVED';
```

```sql

                                                               QUERY PLAN
-----------------------------------------------------------------------------------------------------------------------------------------
 Gather  (cost=1000.00..181807.55 rows=69342 width=40) (actual time=5.104..1176.915 rows=70000 loops=1)
   Workers Planned: 2
   Workers Launched: 2
   ->  Parallel Seq Scan on seat_entity seat  (cost=0.00..173873.35 rows=28892 width=40) (actual time=5.689..400.347 rows=23333 loops=3)
         Filter: ((concert_date_id = 1) AND (status = 'UNRESERVED'::seat_entity_status_enum))
         Rows Removed by Filter: 3476667
 Planning Time: 0.065 ms
 JIT:
   Functions: 12
   Options: Inlining false, Optimization false, Expressions true, Deforming true
   Timing: Generation 1.410 ms, Inlining 0.000 ms, Optimization 1.134 ms, Emission 15.628 ms, Total 18.172 ms
 Execution Time: 1179.438 ms
```

Parallel Seq Scan: 테이블 전체를 스캔하면서 concert_date_id와 status 조건을 병렬 필터링함

2. 단일 인덱스 (concert_date_id)

#### 인덱스 생성

```sql
CREATE INDEX idx_seat_concert_date_id ON seat_entity (concert_date_id);
```

```sql
                                                                       QUERY PLAN
--------------------------------------------------------------------------------------------------------------------------------------------------------
 Index Scan using idx_seat_concert_date_id on seat_entity seat  (cost=0.43..2341.01 rows=34369 width=40) (actual time=0.030..19.256 rows=34872 loops=1)
   Index Cond: (concert_date_id = 1)
   Filter: (status = 'UNRESERVED'::seat_entity_status_enum)
   Rows Removed by Filter: 35128
 Planning Time: 0.085 ms
 Execution Time: 20.588 ms
```

Index Scan: concert_date_id 조건에 인덱스를 사용하여 일부 행만 스캔한 후 status 조건으로 추가 필터링

3. 단일 인덱스 (seat_status)

```sql
CREATE INDEX idx_seat_status ON seat_entity (status);
```

```sql
                                                                QUERY PLAN
------------------------------------------------------------------------------------------------------------------------------------------
 Gather  (cost=1000.00..178309.90 rows=34369 width=40) (actual time=27.011..1080.586 rows=34872 loops=1)
   Workers Planned: 2
   Workers Launched: 2
   ->  Parallel Seq Scan on seat_entity seat  (cost=0.00..173873.00 rows=14320 width=40) (actual time=12.554..361.222 rows=11624 loops=3)
         Filter: ((concert_date_id = 1) AND (status = 'UNRESERVED'::seat_entity_status_enum))
         Rows Removed by Filter: 3488376
 Planning Time: 0.125 ms
 JIT:
   Functions: 12
   Options: Inlining false, Optimization false, Expressions true, Deforming true
   Timing: Generation 4.166 ms, Inlining 0.000 ms, Optimization 1.165 ms, Emission 16.859 ms, Total 22.189 ms
 Execution Time: 1082.351 ms
```

Parallel Seq Scan : status만 인덱스를 적용했으나,status 단일 인덱스만으로는 최적화 효과가 크지 않아 전체 테이블 스캔이 발생.

4. 단일 인덱스 (concert_date_id, seat_status)

```sql
                                                                       QUERY PLAN
--------------------------------------------------------------------------------------------------------------------------------------------------------
 Index Scan using idx_seat_concert_date_id on seat_entity seat  (cost=0.43..2341.01 rows=34369 width=40) (actual time=0.020..20.446 rows=34872 loops=1)
   Index Cond: (concert_date_id = 1)
   Filter: (status = 'UNRESERVED'::seat_entity_status_enum)
   Rows Removed by Filter: 35128
 Planning Time: 0.091 ms
 Execution Time: 21.716 ms
```

Index Scan: concert_date_id 인덱스를 통해 일부 행을 스캔하고 status 조건은 추가 필터링.

5. 복합인덱스 (concert_date_id, seat_status)

```sql
CREATE INDEX idx_seat_concert_date_id_status ON seat_entity (concert_date_id, status);
```

```sql
                                                                           QUERY PLAN
----------------------------------------------------------------------------------------------------------------------------------------------------------------
 Index Scan using idx_seat_concert_date_id_status on seat_entity seat  (cost=0.43..53023.94 rows=34369 width=40) (actual time=0.025..11.327 rows=34872 loops=1)
   Index Cond: ((concert_date_id = 1) AND (status = 'UNRESERVED'::seat_entity_status_enum))
 Planning Time: 0.077 ms
 Execution Time: 12.648 ms
```

Index Scan : 복합 인덱스를 통해 concert_date_id와 status 조건을 동시에 처리

### 3. 성능 비교 요약

| **인덱스 적용**                                  | **Scan 전략**     | **쿼리 계획**            | **예상 비용 (cost)** | **실제 실행 시간 (초)** |
| ------------------------------------------------ | ----------------- | ------------------------ | -------------------- | ----------------------- |
| 인덱스 적용 전                                   | Parallel Seq Scan | Sequential Scan          | 1000.00..181807.55   | 1.179 s                 |
| 단일 인덱스 (concert_date_id)                    | Index Scan        | `concert_date_id` 인덱스 | 0.43..2341.01        | 0.021 s                 |
| 단일 인덱스 (status)                             | Parallel Seq Scan | Sequential Scan          | 1000.00..178309.90   | 1.082 s                 |
| 단일 인덱스 (concert_date_id + status 각각 존재) | Index Scan        | `concert_date_id` 인덱스 | 0.43..2341.01        | 0.022 s                 |
| 복합 인덱스 (concert_date_id, status)            | Index Scan        | 복합 인덱스 Scan         | 0.43..53023.94       | 0.012 s                 |

### 4. 결론

- `concert_date_id`와 `status` 조건이 포함된 복합 인덱스를 사용하여 조회 성능이 크게 개선
- 단일 인덱스보다 복합 인덱스가 최적화에 효과적이며, 실행 시간이 약 93배 빨라졌다.
