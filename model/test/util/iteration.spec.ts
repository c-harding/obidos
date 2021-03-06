import {
  fillArray,
  generate,
  generateArray,
  indexedOuterWindow,
  outerWindow,
  range,
  repeatString,
  trimArray,
} from "@obidos/model/src/util/iteration";

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

  describe("indexedOuterWindow", () => {
    it("returns each pair of items", () => {
      expect([...indexedOuterWindow(2)([1, 2, 3])]).toStrictEqual([
        [
          [undefined, -1],
          [1, 0],
        ],
        [
          [1, 0],
          [2, 1],
        ],
        [
          [2, 1],
          [3, 2],
        ],
        [
          [3, 2],
          [undefined, 3],
        ],
      ]);
    });

    it("works with an offset", () => {
      expect([...indexedOuterWindow(3, -2)(range(3))]).toStrictEqual([
        [
          [undefined, -4],
          [undefined, -3],
          [0, -2],
        ],
        [
          [undefined, -3],
          [0, -2],
          [1, -1],
        ],
        [
          [0, -2],
          [1, -1],
          [2, 0],
        ],
        [
          [1, -1],
          [2, 0],
          [undefined, 1],
        ],
        [
          [2, 0],
          [undefined, 1],
          [undefined, 2],
        ],
      ]);
    });
  });

  describe("generate", () => {
    it.each([0, 1, 4])(
      "calls the callback the right number of times for an array of length %d",
      (n) => {
        const mock = jest.fn();
        [...generate(n, mock)];
        expect(mock).toHaveBeenCalledTimes(n);
      },
    );

    it("counts calls properly", () => {
      const mock = jest.fn();

      mock(1, 2);
      expect(mock).not.toHaveBeenCalledWith();

      mock();
      expect(mock).toHaveBeenCalledWith();
    });

    it("calls the callback lazily", () => {
      const mock = jest.fn();
      const generator = generate(5, mock);
      expect(mock).not.toHaveBeenCalled();

      generator.next();
      expect(mock).toHaveBeenCalledTimes(1);

      // expect mock to have been called without arguments (see generate › counts calls properly)
      expect(mock).toHaveBeenCalledWith();
    });

    it("produces the right sequence", () => {
      let count = 0;
      const counter = () => count++;
      expect([...generate(5, counter)]).toStrictEqual([0, 1, 2, 3, 4]);
    });
  });

  describe("generateArray", () => {
    it.each([0, 1, 4])(
      "calls the callback the right number of times for an array of length %d",
      (n) => {
        const mock = jest.fn();
        generateArray(n, mock);
        expect(mock).toHaveBeenCalledTimes(n);
      },
    );

    it("produces the right array", () => {
      let count = 0;
      const counter = () => count++;
      expect(generateArray(5, counter)).toStrictEqual([0, 1, 2, 3, 4]);
    });
  });

  describe("fillArray", () => {
    it("fills an array with copies", () => {
      const array = fillArray(3, {});

      expect(array[0]).toBe(array[1]);
      expect(array[0]).toBe(array[2]);

      // This is not equal to a different object
      expect(array[0]).not.toBe({});
    });
  });

  describe("repeatString", () => {
    it("repeats a single character", () => {
      expect(repeatString(5, "l")).toBe("lllll");
    });

    it("repeats multiple characters", () => {
      expect(repeatString(5, "<>")).toBe("<><><><><>");
    });

    it("repeats 0 times to produce an empty string", () => {
      expect(repeatString(0, "<>")).toBe("");
    });
  });

  describe("trimArray", () => {
    it("does nothing when there are no empty strings", () => {
      expect(trimArray(["a", "bbb", "c"])).toStrictEqual(["a", "bbb", "c"]);
    });

    it("does nothing when there are no empty string at either end", () => {
      expect(trimArray(["a", "", "c"])).toStrictEqual(["a", "", "c"]);
    });

    it("removes empty strings at the start", () => {
      expect(trimArray(["", "", "c", "dd"])).toStrictEqual(["c", "dd"]);
    });

    it("removes empty strings at the end", () => {
      expect(trimArray(["a", "bb", "c", "", "", ""])).toStrictEqual(["a", "bb", "c"]);
    });

    it("removes empty strings at both ends", () => {
      expect(trimArray(["", "bb", "c", "", "", ""])).toStrictEqual(["bb", "c"]);
    });

    it("returns an empty array when there are no non-empty entries", () => {
      expect(trimArray(["", "", "", "", "", ""])).toStrictEqual([]);
    });
  });
});
