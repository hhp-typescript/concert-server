export abstract class EntityId<T extends string | number> {
  protected constructor(private readonly value: T) {}

  getValue(): T {
    return this.value;
  }

  equals(other: EntityId<T>): boolean {
    return this.value === other.value;
  }
}
