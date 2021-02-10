import { defaultCards } from "../../src/game/DefaultGame";
import { tileToStrings } from "../../src/game/PrintDeck";

describe("PrintDeck", () => {
  it("prints a road properly", () => {
    expect(tileToStrings("+", defaultCards.U, 7)).toStrictEqual([
      "+--------------+",
      "+      ||      +",
      "+      ||      +",
      "+      ||      +",
      "+      ||      +",
      "+      ||      +",
      "+      ||      +",
      "+      ||      +",
      "+--------------+",
    ]);
  });

  it("prints a crossroads properly", () => {
    expect(tileToStrings("+", defaultCards.X, 5)).toStrictEqual([
      "+----------+",
      "+    ||    +",
      "+    ||    +",
      "+====><====+",
      "+    ||    +",
      "+    ||    +",
      "+----------+",
    ]);
  });

  it("prints a cloister with a road properly", () => {
    expect(tileToStrings("+", defaultCards.A, 7)).toStrictEqual([
      "+--------------+",
      "+              +",
      "+              +",
      "+              +",
      "+      ⛪      +",
      "+      ||      +",
      "+      ||      +",
      "+      ||      +",
      "+--------------+",
    ]);
  });

  it("prints a single two-sided city", () => {
    expect(tileToStrings("+", defaultCards.M, 7)).toStrictEqual([
      "+--------------+",
      "+🏠🏠🏠🏠🏠🏠  +",
      "+🏠🏠🏠🏠🏠    +",
      "+🏠🏠🏠🏠      +",
      "+🏠🏠🏠        +",
      "+🏠🏠          +",
      "+🏠            +",
      "+              +",
      "+--------------+",
    ]);
  });
  it("prints a long thin city", () => {
    expect(tileToStrings("+", defaultCards.F, 9)).toStrictEqual([
      "+------------------+",
      "+🏠              🏠+",
      "+🏠🏠          🏠🏠+",
      "+🏠🏠🏠🏠🏠🏠🏠🏠🏠+",
      "+🏠🏠🏠🏠🏠🏠🏠🏠🏠+",
      "+🏠🏠🏠🏠🏠🏠🏠🏠🏠+",
      "+🏠🏠🏠🏠🏠🏠🏠🏠🏠+",
      "+🏠🏠🏠🏠🏠🏠🏠🏠🏠+",
      "+🏠🏠          🏠🏠+",
      "+🏠              🏠+",
      "+------------------+",
    ]);
  });
  it("prints a pair of cities", () => {
    expect(tileToStrings("+", defaultCards.I, 9)).toStrictEqual([
      "+------------------+",
      "+                  +",
      "+                🏠+",
      "+              🏠🏠+",
      "+              🏠🏠+",
      "+              🏠🏠+",
      "+              🏠🏠+",
      "+              🏠🏠+",
      "+    🏠🏠🏠🏠🏠  🏠+",
      "+  🏠🏠🏠🏠🏠🏠🏠  +",
      "+------------------+",
    ]);
  });
});
