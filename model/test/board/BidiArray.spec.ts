import BidiArray from "@obidos/model/src/board/BidiArray";

describe("BidiArray", () => {
  it("starts with the correct min and max when empty", () => {
    const array = new BidiArray();
    expect(array.min).toBe(0);
    expect(array.max).toBe(0);
  });

  it("starts with the correct min and max when initialized", () => {
    const array = new BidiArray("initial value");
    expect(array.min).toBe(0);
    expect(array.max).toBe(1);
  });

  it("converts correctly to an array when empty", () => {
    const array = new BidiArray();
    expect([...array]).toStrictEqual([]);
  });

  it("converts correctly to an array when initialized", () => {
    const array = new BidiArray("initial value");
    expect([...array]).toStrictEqual(["initial value"]);
  });

  it("gets undefined when empty", () => {
    const array = new BidiArray();
    expect(array.get(0)).toBeUndefined();
    expect(array.get(1)).toBeUndefined();
    expect(array.get(-1)).toBeUndefined();
    expect(array.get(10)).toBeUndefined();
    expect(array.get(-10)).toBeUndefined();
  });

  it("gets undefined where not defined", () => {
    const array = new BidiArray("initial value");
    expect(array.get(1)).toBeUndefined();
    expect(array.get(-1)).toBeUndefined();
    expect(array.get(10)).toBeUndefined();
    expect(array.get(-10)).toBeUndefined();
  });

  it("gets the initial value", () => {
    const array = new BidiArray("initial value");
    expect(array.get(0)).toStrictEqual("initial value");
  });

  it("sets contiguously before", () => {
    const array = new BidiArray("zero");
    array.set(-1, "before");
    expect(array.get(0)).toStrictEqual("zero");
    expect(array.get(1)).toBeUndefined();
    expect(array.get(-1)).toStrictEqual("before");
    expect([...array]).toStrictEqual(["before", "zero"]);
  });

  it("sets contiguously after", () => {
    const array = new BidiArray("zero");
    array.set(1, "after");
    expect(array.get(0)).toStrictEqual("zero");
    expect(array.get(-1)).toBeUndefined();
    expect(array.get(1)).toStrictEqual("after");
    expect([...array]).toStrictEqual(["zero", "after"]);
  });

  it("sets before and after", () => {
    const array = new BidiArray("zero");
    array.set(-1, "before");
    array.set(-2, "before before");
    array.set(1, "after");
    array.set(2, "after after");
    expect([...array]).toStrictEqual([
      "before before",
      "before",
      "zero",
      "after",
      "after after",
    ]);
  });

  it("sets with gaps", () => {
    const array = new BidiArray();
    array.set(-1, "before");
    array.set(2, "after after");
    expect([...array]).toStrictEqual(["before", undefined, undefined, "after after"]);
    expect(array.get(-1)).toStrictEqual("before");
    expect(array.get(0)).toBeUndefined();
    expect(array.get(1)).toBeUndefined();
    expect(array.get(2)).toStrictEqual("after after");
  });

  it("overwrites", () => {
    const array = new BidiArray("zero");
    array.set(0, "new");
    expect(array.get(0)).toStrictEqual("new");
  });
});
