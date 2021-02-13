export default class MemoizedProp<T> {
  private static unset = Symbol();
  constructor(private version: () => unknown, private getter: () => T) {}

  private cachedValue: T;
  private cachedAt: unknown = MemoizedProp.unset;

  get value(): T {
    if (this.version() !== this.cachedAt) {
      this.cachedValue = this.getter();
      this.cachedAt = this.version();
    }
    return this.cachedValue;
  }
}
