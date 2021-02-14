import type { WuIterable } from "wu";
import wu, { chain, repeat } from "wu";

export function enumerate<T>(iterable: Iterable<T>, offset = 0): WuIterable<Indexed<T>> {
  return wu.enumerate(iterable).map(([val, i]) => [val, i + offset]);
}

export const window = (size: number) =>
  function* <T>(iterable: Iterable<T>): Generator<T[]> {
    let window: T[] = [];
    for (const item of iterable) {
      if (window.length === size) window = window.slice(1);
      window.push(item);

      if (window.length === size) {
        yield window;
      }
    }
  };

/**
 * Return consecutive sequences of the generator of size `size`. Any items before the start or after
 * the end will be undefined.
 *
 * E.g. outerWindow(3)([1,2,3]) will yield ([u, u, 1], [u, 1, 2], [1, 2, 3], [2, 3, u], [3, u, u])
 * @param iterable Any sequence of terms to iterate over
 * @param size The size of the window
 */
export const outerWindow = (size: number) =>
  function <T>(iterable: Iterable<T>): Generator<(T | undefined)[]> {
    let blanks = () => repeat(undefined, size - 1);
    return window(size)(chain(blanks(), iterable, blanks()));
  };

export type Indexed<T> = [T, number];

/**
 * Return consecutive sequences of the generator of size `size`. Any items before or after the end
 * will be undefined. Every value will be paired with its index. If enumerateFrom is provided, all
 * indices will be offset by this value, so the first item in the array will be numbered
 * `enumerateFrom`.
 *
 * E.g. indexedOuterWindow(3)([1,2,3]) will yield
 *  ([[u, -2], [u, -1], [1,  0]],
 *   [[u, -1], [1,  0], [2,  1]],
 *   [[1,  0], [2,  1], [3,  2]],
 *   [[2,  1], [3,  2], [u,  3]],
 *   [[3,  2], [u,  3], [u,  4]])
 * where u = undefined
 *
 * @param iterable Any sequence of terms to iterate over
 * @param size The size of the window
 */
export const indexedOuterWindow = (size: number, enumerateFrom = 0) =>
  function <T>(iterable: Iterable<T>): Generator<Indexed<T | undefined>[]> {
    let blanks = () => repeat(undefined, size - 1);
    return window(size)(
      enumerate(chain(blanks(), iterable, blanks()), enumerateFrom - size + 1),
    );
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

export function trimArray(lines: string[]): string[] {
  const start = lines.findIndex((x) => x.length !== 0);
  const end = range(lines.length - 1, -1, -1).find((i) => lines[i].length !== 0) ?? -1;
  if (start === 0 && end === lines.length - 1) return lines;
  else return lines.slice(start, end + 1);
}
