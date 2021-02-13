import { Board } from "@obidos/model/src/board/Board";
import { defaultCards } from "@obidos/model/src/game/DefaultGame";
import ConsoleRenderer from "../../src/printer/ConsoleRenderer";
import type { Tile } from "@obidos/model/src/tile/Tile";

function tileRenderer(renderer: ConsoleRenderer, tile: Tile): string[] {
  return renderer.renderTile(tile);
}
function boardRenderer(renderer: ConsoleRenderer, tile: Tile): string[] {
  return renderer.renderBoard(new Board(tile));
}

describe("ConsoleRenderer", () => {
  describe.each([
    ["renderTile", tileRenderer],
    ["renderBoard", boardRenderer],
  ])("%s", (_name, renderer) => {
    it("prints a road properly", () => {
      expect(renderer(new ConsoleRenderer(7), defaultCards.U)).toStrictEqual([
        "┏━━━━━━┥┝━━━━━━┓",
        "┃      ││      ┃",
        "┃      ││      ┃",
        "┃      ││      ┃",
        "┃      ││      ┃",
        "┃      ││      ┃",
        "┃      ││      ┃",
        "┃      ││      ┃",
        "┗━━━━━━┥┝━━━━━━┛",
      ]);
    });

    it("prints a crossroads properly", () => {
      expect(renderer(new ConsoleRenderer(5), defaultCards.X)).toStrictEqual([
        "┏━━━━┥┝━━━━┓",
        "┃    ││    ┃",
        "┃    ││    ┃",
        "╪════╳╳════╪",
        "┃    ││    ┃",
        "┃    ││    ┃",
        "┗━━━━┥┝━━━━┛",
      ]);
    });

    it("prints a cloister with a road properly", () => {
      expect(renderer(new ConsoleRenderer(7), defaultCards.A)).toStrictEqual([
        "┏━━━━━━━━━━━━━━┓",
        "┃              ┃",
        "┃              ┃",
        "┃              ┃",
        "┃      ⛪      ┃",
        "┃      ││      ┃",
        "┃      ││      ┃",
        "┃      ││      ┃",
        "┗━━━━━━┥┝━━━━━━┛",
      ]);
    });

    it("prints a single two-sided city", () => {
      expect(renderer(new ConsoleRenderer(7), defaultCards.M)).toStrictEqual([
        "┏━━━━━━━━━━━━━━┓",
        "┃🏠🏠🏠🏠🏠🏠  ┃",
        "┃🏠🏠🏠🏠🏠    ┃",
        "┃🏠🏠🏠🏠      ┃",
        "┃🏠🏠🏠        ┃",
        "┃🏠🏠          ┃",
        "┃🏠            ┃",
        "┃              ┃",
        "┗━━━━━━━━━━━━━━┛",
      ]);
    });
    it("prints a long thin city", () => {
      expect(renderer(new ConsoleRenderer(9), defaultCards.F)).toStrictEqual([
        "┏━━━━━━━━━━━━━━━━━━┓",
        "┃🏠              🏠┃",
        "┃🏠🏠          🏠🏠┃",
        "┃🏠🏠🏠🏠🏠🏠🏠🏠🏠┃",
        "┃🏠🏠🏠🏠🏠🏠🏠🏠🏠┃",
        "┃🏠🏠🏠🏠🏠🏠🏠🏠🏠┃",
        "┃🏠🏠🏠🏠🏠🏠🏠🏠🏠┃",
        "┃🏠🏠🏠🏠🏠🏠🏠🏠🏠┃",
        "┃🏠🏠          🏠🏠┃",
        "┃🏠              🏠┃",
        "┗━━━━━━━━━━━━━━━━━━┛",
      ]);
    });
    it("prints a pair of cities", () => {
      expect(renderer(new ConsoleRenderer(9), defaultCards.I)).toStrictEqual([
        "┏━━━━━━━━━━━━━━━━━━┓",
        "┃                  ┃",
        "┃                🏠┃",
        "┃              🏠🏠┃",
        "┃              🏠🏠┃",
        "┃              🏠🏠┃",
        "┃              🏠🏠┃",
        "┃              🏠🏠┃",
        "┃    🏠🏠🏠🏠🏠  🏠┃",
        "┃  🏠🏠🏠🏠🏠🏠🏠  ┃",
        "┗━━━━━━━━━━━━━━━━━━┛",
      ]);
    });
  });
});
