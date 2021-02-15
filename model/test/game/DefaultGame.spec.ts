import { defaultDrawPile, defaultTiles } from "../../src/game/DefaultGame";

const UNIQUE_CARD_COUNT = 24;
const DRAW_PILE_SIZE = 71;

describe("DefaultGame", () => {
  describe("defaultCards", () => {
    it("has the right number of tile types", () => {
      expect(Object.values(defaultTiles)).toHaveLength(UNIQUE_CARD_COUNT);
    });

    it("has no duplicates", () => {
      expect(new Set(Object.values(defaultTiles)).size).toBe(UNIQUE_CARD_COUNT);
    });
  });

  describe("defaultDrawPile", () => {
    it("has the right number of tiles", () => {
      expect(Object.values(defaultDrawPile)).toHaveLength(DRAW_PILE_SIZE);
    });

    it("contains the right number of unique tile types", () => {
      expect(new Set(Object.values(defaultDrawPile)).size).toBe(UNIQUE_CARD_COUNT);
    });
  });
});
