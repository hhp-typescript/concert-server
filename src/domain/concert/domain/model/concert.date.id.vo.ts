import { EntityId } from 'src/common/domain/model/base.id.vo';

export class ConcertDateId extends EntityId<number> {
  private constructor(value: number) {
    super(value);
  }
  static of(value: number): ConcertDateId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('ConcertDateId는 양의 정수여야 합니다.');
    }
    return new ConcertDateId(value);
  }
}
