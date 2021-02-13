import { outerWindow, range } from "../src/iteration";

describe("iteration", () => {
  describe("range", () => {
    it("returns nothing when counting to 0", () => {
      expect([...range(0)]).toStrictEqual([]);
    });

    it("iterates up to 5, exclusive", () => {
      expect([...range(5)]).toStrictEqual([0, 1, 2, 3, 4]);
    });

    it("iterates from 2 to 6, exclusive", () => {
      expect([...range(2, 6)]).toStrictEqual([2, 3, 4, 5]);
    });

    it("iterates from -3 to 0, exclusive", () => {
      expect([...range(-3, 0)]).toStrictEqual([-3, -2, -1]);
    });

    it("iterates with a step", () => {
      expect([...range(0, 7, 2)]).toStrictEqual([0, 2, 4, 6]);
    });

    it("iterates down with a negative step", () => {
      expect([...range(8, 1, -2)]).toStrictEqual([8, 6, 4, 2]);
    });

    it("iterates from positive to negative with a negative step", () => {
      expect([...range(5, -20, -5)]).toStrictEqual([5, 0, -5, -10, -15]);
    });
  });

  describe("outerWindow", () => {
    it("returns each pair of items", () => {
      expect([...outerWindow(2)([1, 2, 3])]).toStrictEqual([
        [undefined, 1],
        [1, 2],
        [2, 3],
        [3, undefined],
      ]);
    });

    it("returns each triplet of items", () => {
      expect([...outerWindow(3)([1, 2, 3])]).toStrictEqual([
        [undefined, undefined, 1],
        [undefined, 1, 2],
        [1, 2, 3],
        [2, 3, undefined],
        [3, undefined, undefined],
      ]);
    });

    it("works with generators", () => {
      expect([...outerWindow(3)(range(3))]).toStrictEqual([
        [undefined, undefined, 0],
        [undefined, 0, 1],
        [0, 1, 2],
        [1, 2, undefined],
        [2, undefined, undefined],
      ]);
    });

    it("returns nothing if the size is 1 and the range is empty", () => {
      expect([...outerWindow(1)([])]).toStrictEqual([]);
    });

    it("returns the before and after elements if the size is 2 and the range is empty", () => {
      expect([...outerWindow(2)([])]).toStrictEqual([[undefined, undefined]]);
    });
  });
});
