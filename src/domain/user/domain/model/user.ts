import { Point } from './point';
import { UserId } from './user.id.vo';

export type NewUserProps = {
  name: string;
  point?: Point;
};

export type PersistedUserProps = {
  id: UserId;
  name: string;
  point?: Point;
};

export type UserProps = NewUserProps | PersistedUserProps;

export class User {
  private constructor(private props: UserProps) {}

  static createNew(props: NewUserProps): User {
    return new User(props);
  }

  static reconstitute(props: PersistedUserProps): User {
    return new User(props);
  }

  hasId(): boolean {
    return 'id' in this.props;
  }

  get id(): UserId {
    if (!('id' in this.props)) throw new Error('id가 없는 User');
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get point(): Point {
    return this.props.point;
  }
}
