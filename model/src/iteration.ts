import { chain } from "wu";

/**
 * Return consecutive sequences of the generator of size `size`. Any items before or after the end
 * will be undefined.
 *
 * E.g. outerWindow([1,2,3], 3) will yield ([u, u, 1], [u, 1, 2], [1, 2, 3], [2, 3, u], [3, u, u])
 * @param iterable Any sequence of terms to iterate over
 * @param size The size of the window
 */
export function* outerWindow<T>(
  iterable: Iterable<T>,
  size: number,
): Generator<(T | undefined)[]> {
  let window = new Array(size).fill(undefined);

  for (const item of chain(iterable, window.slice(1))) {
    window = window.slice(1);
    window.push(item);
    yield window;
  }
}

export function range(end: number): Generator<number>;
export function range(start: number, end: number, step?: number): Generator<number>;
export function* range(a: number, b?: number, step = 1): Generator<number> {
  const [start, stop] = b === undefined ? [0, a] : [a, b];
  if (step > 0) {
    for (let i = start; i < stop; i += step) yield i;
  } else {
    for (let i = start; i > stop; i += step) yield i;
  }
}
