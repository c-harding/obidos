import { range } from "@obidos/model/src/util/iteration";
import { shuffle } from "@obidos/model/src/util/random";

describe("random", () => {
  describe("shuffle", () => {
    it.each([0, 1, 3, 10])("maintains length %i", (length) => {
      const shuffled = shuffle([...range(length)]);
      expect(shuffled).toHaveLength(length);
    });

    it("shuffles in place", () => {
      const array = [...range(5)];
      const shuffled = shuffle(array);
      expect(array).toBe(shuffled);
    });

    it("maintains object equality", () => {
      const array = [...range(5).map((i) => ({ index: i }))];
      const shuffled = shuffle(array.slice());
      expect(array.every((element) => shuffled.includes(element))).toBe(true);
      expect(shuffled.every((element) => array.includes(element))).toBe(true);
    });

    // There are 20! (20 factorial) possible orders of an array of length 20,
    // so if this genuinely does shuffle then there is a 1 in 10^18 chance of it maintaining order.
    it("does not preserve order", () => {
      const array = [...range(20)];
      const copy = array.slice();
      expect(copy).toStrictEqual(array);
      shuffle(copy);
      expect(copy).not.toStrictEqual(array);
    });

    // There are 20! (20 factorial) possible orders of an array of length 20,
    // so if this genuinely does shuffle then there is a 1 in 10^18 chance of it maintaining order.
    it("shuffles twice differently", () => {
      const array = [...range(20)];
      const shuffle1 = shuffle(array.slice());
      const shuffle2 = shuffle(array.slice());
      expect(shuffle1).not.toStrictEqual(shuffle2);
    });
  });
});
