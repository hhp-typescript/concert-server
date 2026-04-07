import { EntityId } from 'src/common/domain/model/base.id.vo';

export class SeatId extends EntityId<number> {
  private constructor(value: number) {
    super(value);
  }
  static of(value: number): SeatId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('SeatId는 양의 정수여야 합니다.');
    }
    return new SeatId(value);
  }
}
