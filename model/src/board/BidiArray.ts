export default class BidiArray<T> {
  private readonly negative: (T | undefined)[] = [];
  private readonly positive: (T | undefined)[] = [];

  constructor(initialValue?: T) {
    if (initialValue !== undefined) {
      this.positive.push(initialValue);
    }
  }

  get(i: number): T | undefined {
    if (i < 0) return this.negative[-i - 1];
    else return this.positive[i];
  }

  set<V extends T | undefined>(i: number, value: V): V {
    if (i < 0) this.negative[-i - 1] = value;
    else this.positive[i] = value;
    return value;
  }

  /**
   * The first position on the row, inclusive.
   *
   * Returns 0 rather than -0 if there are no negative entries.
   */
  get min(): number {
    return -this.negative.length || 0;
  }

  /** The final position on the row, exclusive */
  get max(): number {
    return this.positive.length;
  }

  *[Symbol.iterator](): Generator<T | undefined> {
    // Avoid multiple accesses to the getter
    const max = this.max;

    for (let i = this.min; i < max; i++) {
      yield this.get(i);
    }
  }
}
