import { range } from "@obidos/model/src/util/iteration";

/**
 * Fisher-Yates shuffle algorithm, in-place
 */
export function shuffle<T>(array: T[]): T[] {
  for (const i of range(array.length - 1, 0, -1)) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
