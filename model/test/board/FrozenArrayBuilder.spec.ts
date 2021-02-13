import FrozenArrayBuilder from "../../src/board/FrozenArrayBuilder";

describe("FrozenArrayBuilder", () => {
  it("builds an empty array", () => {
    const arrayBuilder = new FrozenArrayBuilder<number>();
    const array = arrayBuilder.build();
    expect(array).toStrictEqual([]);
  });

  it("blocks writing to the resulting array", () => {
    const arrayBuilder = new FrozenArrayBuilder<number>();
    const array: readonly number[] = arrayBuilder.build();

    // Cast from readonly to force allowing editing
    const mutableArray = array as number[];
    expect(() => {
      mutableArray.push(123);
    }).toThrowError(TypeError);

    expect(() => {
      mutableArray[0] = 123;
    }).toThrowError(TypeError);
  });

  it("builds idempotently", () => {
    const arrayBuilder = new FrozenArrayBuilder<number>();
    arrayBuilder.push(4);
    const firstBuild = arrayBuilder.build();
    const secondBuild = arrayBuilder.build();
    expect(firstBuild).toBe(secondBuild);
  });

  it("blocks pushing to the builder after building", () => {
    const arrayBuilder = new FrozenArrayBuilder<number>();
    arrayBuilder.build();
    expect(() => {
      arrayBuilder.push(1, 2, 3);
    }).toThrowError(TypeError);
  });

  it("builds with one insertion", () => {
    const arrayBuilder = new FrozenArrayBuilder<number>();
    arrayBuilder.push(12);
    const array = arrayBuilder.build();
    expect(array).toStrictEqual([12]);
  });

  it("builds with multiple insertions", () => {
    const arrayBuilder = new FrozenArrayBuilder<number>();
    arrayBuilder.push(12);
    arrayBuilder.push(23);
    const array = arrayBuilder.build();
    expect(array).toStrictEqual([12, 23]);
  });

  it("works with variable numbers of arguments", () => {
    const arrayBuilder = new FrozenArrayBuilder<number>();
    arrayBuilder.push(1, 2, 3);
    arrayBuilder.push();
    arrayBuilder.push(4);
    const array = arrayBuilder.build();
    expect(array).toStrictEqual([1, 2, 3, 4]);
  });

  it("supports chaining", () => {
    const array = new FrozenArrayBuilder<number>().push(1).push(2).build();
    expect(array).toStrictEqual([1, 2]);
  });

  it("works with strings", () => {
    const array = new FrozenArrayBuilder<string>().push("String").push("other").build();
    expect(array).toStrictEqual(["String", "other"]);
  });

  it("maintains object equality", () => {
    const anObject = { a: 1 };
    const array = new FrozenArrayBuilder<{ a: number }>().push(anObject).build();
    expect(array).toContain(anObject);

    // Proof that this was testing for object equality rather than structural equality
    expect(array).not.toContain({ a: 1 });
  });

  it("maintains object equality for exotic objects", () => {
    const aFunction = () => undefined;
    const aPromise = new Promise((resolve) => setTimeout(resolve, 1));
    const array = new FrozenArrayBuilder().push(aFunction, aPromise).build();
    expect(array).toContain(aFunction);
    expect(array).toContain(aPromise);
  });
});
