import { BaseOutboxEntity } from 'src/common/infrastructure';
import { Entity } from 'typeorm';

@Entity()
export class ReservationOutboxEntity extends BaseOutboxEntity {}
