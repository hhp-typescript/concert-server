import { ReservationId } from 'src/domain/reservation/domain/model/reservation.id.vo';
import { UserId } from 'src/domain/user/domain/model/user.id.vo';
import { PaymentId } from './payment.id.vo';

export enum PaymentStatus {
  COMPLETED,
  FAILED,
}

export type NewPaymentProps = {
  reservationId: ReservationId;
  userId: UserId;
  price: number;
  status: PaymentStatus;
};

export type PersistedPaymentProps = {
  id: PaymentId;
  reservationId: ReservationId;
  userId: UserId;
  price: number;
  status: PaymentStatus;
};

export type PaymentProps = NewPaymentProps | PersistedPaymentProps;

export class Payment {
  private constructor(private props: PaymentProps) {}

  static createNew(props: NewPaymentProps): Payment {
    return new Payment(props);
  }

  static reconstitute(props: PersistedPaymentProps): Payment {
    return new Payment(props);
  }

  hasId(): boolean {
    return 'id' in this.props;
  }

  get id(): PaymentId {
    if (!('id' in this.props)) throw new Error('id가 없는 Payment');
    return this.props.id;
  }

  get reservationId(): ReservationId {
    return this.props.reservationId;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get price(): number {
    return this.props.price;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }
}
