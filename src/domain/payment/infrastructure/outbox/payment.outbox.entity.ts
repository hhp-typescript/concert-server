import { BaseOutboxEntity } from 'src/common/infrastructure';
import { Entity } from 'typeorm';

@Entity()
export class PaymentOutboxEntity extends BaseOutboxEntity {}
