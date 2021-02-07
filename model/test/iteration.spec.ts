import { range } from "../src/iteration";

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
});
