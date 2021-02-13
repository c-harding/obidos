import { defaultCards } from "../../src/game/DefaultGame";
import ConsoleRenderer from "../../src/printer/ConsoleRenderer";

describe("ConsoleRenderer", () => {
  it("prints a road properly", () => {
    expect(new ConsoleRenderer(7).renderTile(defaultCards.U)).toStrictEqual([
      "╋━━━━━━━━━━━━━━╋",
      "┃      ││      ┃",
      "┃      ││      ┃",
      "┃      ││      ┃",
      "┃      ││      ┃",
      "┃      ││      ┃",
      "┃      ││      ┃",
      "┃      ││      ┃",
      "╋━━━━━━━━━━━━━━╋",
    ]);
  });

  it("prints a crossroads properly", () => {
    expect(new ConsoleRenderer(5).renderTile(defaultCards.X)).toStrictEqual([
      "╋━━━━━━━━━━╋",
      "┃    ││    ┃",
      "┃    ││    ┃",
      "┃════╳╳════┃",
      "┃    ││    ┃",
      "┃    ││    ┃",
      "╋━━━━━━━━━━╋",
    ]);
  });

  it("prints a cloister with a road properly", () => {
    expect(new ConsoleRenderer(7).renderTile(defaultCards.A)).toStrictEqual([
      "╋━━━━━━━━━━━━━━╋",
      "┃              ┃",
      "┃              ┃",
      "┃              ┃",
      "┃      ⛪      ┃",
      "┃      ││      ┃",
      "┃      ││      ┃",
      "┃      ││      ┃",
      "╋━━━━━━━━━━━━━━╋",
    ]);
  });

  it("prints a single two-sided city", () => {
    expect(new ConsoleRenderer(7).renderTile(defaultCards.M)).toStrictEqual([
      "╋━━━━━━━━━━━━━━╋",
      "┃🏠🏠🏠🏠🏠🏠  ┃",
      "┃🏠🏠🏠🏠🏠    ┃",
      "┃🏠🏠🏠🏠      ┃",
      "┃🏠🏠🏠        ┃",
      "┃🏠🏠          ┃",
      "┃🏠            ┃",
      "┃              ┃",
      "╋━━━━━━━━━━━━━━╋",
    ]);
  });
  it("prints a long thin city", () => {
    expect(new ConsoleRenderer(9).renderTile(defaultCards.F)).toStrictEqual([
      "╋━━━━━━━━━━━━━━━━━━╋",
      "┃🏠              🏠┃",
      "┃🏠🏠          🏠🏠┃",
      "┃🏠🏠🏠🏠🏠🏠🏠🏠🏠┃",
      "┃🏠🏠🏠🏠🏠🏠🏠🏠🏠┃",
      "┃🏠🏠🏠🏠🏠🏠🏠🏠🏠┃",
      "┃🏠🏠🏠🏠🏠🏠🏠🏠🏠┃",
      "┃🏠🏠🏠🏠🏠🏠🏠🏠🏠┃",
      "┃🏠🏠          🏠🏠┃",
      "┃🏠              🏠┃",
      "╋━━━━━━━━━━━━━━━━━━╋",
    ]);
  });
  it("prints a pair of cities", () => {
    expect(new ConsoleRenderer(9).renderTile(defaultCards.I)).toStrictEqual([
      "╋━━━━━━━━━━━━━━━━━━╋",
      "┃                  ┃",
      "┃                🏠┃",
      "┃              🏠🏠┃",
      "┃              🏠🏠┃",
      "┃              🏠🏠┃",
      "┃              🏠🏠┃",
      "┃              🏠🏠┃",
      "┃    🏠🏠🏠🏠🏠  🏠┃",
      "┃  🏠🏠🏠🏠🏠🏠🏠  ┃",
      "╋━━━━━━━━━━━━━━━━━━╋",
    ]);
  });
});
