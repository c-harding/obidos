export default class FrozenArrayBuilder<T> {
  #array: T[] = [];

  /**
   * Freezes and appends new elements to an array, and returns the builder.
   * @param items New elements of the Array.
   */
  push(...values: T[]): this {
    this.#array.push(...values.map((item) => Object.freeze(item)));
    return this;
  }

  /**
   * Freeze the array being built. Once this has been called, no further items can be pushed.
   */
  build(): readonly T[] {
    return Object.freeze(this.#array);
  }
}
