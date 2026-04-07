import { EntityId } from 'src/common/domain/model/base.id.vo';

export class UserId extends EntityId<number> {
  private constructor(value: number) {
    super(value);
  }
  static of(value: number): UserId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('UserId는 양의 정수여야 합니다.');
    }
    return new UserId(value);
  }
}
