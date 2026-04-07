import { EntityId } from 'src/common/domain/model/base.id.vo';

export class ConcertId extends EntityId<number> {
  private constructor(value: number) {
    super(value);
  }
  static of(value: number): ConcertId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('ConcertId는 양의 정수여야 합니다.');
    }
    return new ConcertId(value);
  }
}
