import { EntityId } from 'src/common/domain/model/base.id.vo';

export class PaymentId extends EntityId<number> {
  private constructor(value: number) {
    super(value);
  }
  static of(value: number): PaymentId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('PaymentId는 양의 정수여야 합니다.');
    }
    return new PaymentId(value);
  }
}
