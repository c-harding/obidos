import type { WuIterable } from "wu";
import wu, { repeat } from "wu";
import { chain } from "wu";

/**
 * Return consecutive sequences of the generator of size `size`. Any items before or after the end
 * will be undefined.
 *
 * E.g. outerWindow(3)([1,2,3]) will yield ([u, u, 1], [u, 1, 2], [1, 2, 3], [2, 3, u], [3, u, u])
 * @param iterable Any sequence of terms to iterate over
 * @param size The size of the window
 */
export const outerWindow = (size: number) =>
  function* <T>(iterable: Iterable<T>): Generator<(T | undefined)[]> {
    let window = new Array(size).fill(undefined);

    for (const item of chain(iterable, window.slice(1))) {
      window = window.slice(1);
      window.push(item);
      yield window;
    }
  };

function* rangeGenerator(a: number, b?: number, step = 1): Generator<number> {
  const [start, stop] = b === undefined ? [0, a] : [a, b];
  if (step > 0) {
    for (let i = start; i < stop; i += step) yield i;
  } else {
    for (let i = start; i > stop; i += step) yield i;
  }
}

export function range(end: number): WuIterable<number>;
export function range(start: number, end: number, step?: number): WuIterable<number>;
export function range(a: number, b?: number, step = 1): WuIterable<number> {
  return wu(rangeGenerator(a, b, step));
}

export function generate<T>(count: number, generator: () => T): WuIterable<T> {
  return range(count).map(() => generator());
}

export function generateArray<T>(count: number, generator: () => T): T[] {
  return generate(count, generator).toArray();
}

export function fillArray<T>(count: number, item: T): T[] {
  return repeat(item, count).toArray();
}

export function repeatString(count: number, string: string): string {
  return Array(count + 1).join(string);
}
