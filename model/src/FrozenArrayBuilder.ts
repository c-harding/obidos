export default class FrozenArrayBuilder<T> {
  #array = [];

  /**
   * Freezes and appends new elements to an array, and returns the new length of the array.
   * @param items New elements of the Array.
   */
  push(...values: T[]): number {
    return this.#array.push(...values.map((item) => Object.freeze(item)));
  }

  /**
   * Freeze the array being built. Once this has been called, no further items can be pushed.
   */
  build(): readonly T[] {
    return Object.freeze(this.#array);
  }
}
