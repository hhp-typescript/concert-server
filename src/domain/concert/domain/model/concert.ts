import { ConcertId } from './concert.id.vo';

export type NewConcertProps = {
  name: string;
  description: string;
};
export type PersistedConcertProps = {
  id: ConcertId;
  name: string;
  description: string;
};
export type concertProps = NewConcertProps | PersistedConcertProps;

export class Concert {
  private constructor(private props: concertProps) {}

  static createNew(props: NewConcertProps): Concert {
    return new Concert(props);
  }

  static reconstitute(props: PersistedConcertProps): Concert {
    return new Concert(props);
  }
  hasId(): boolean {
    return 'id' in this.props;
  }

  get id(): ConcertId {
    if (!('id' in this.props)) throw new Error('id가 없는 Concert');

    return this.props.id;
  }

  get description(): string {
    return this.props.description;
  }

  get name(): string {
    return this.props.name;
  }
}
