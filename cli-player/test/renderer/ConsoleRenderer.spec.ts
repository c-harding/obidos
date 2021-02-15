import { Board } from "@obidos/model/src/board/Board";
import { defaultTiles } from "@obidos/model/src/game/DefaultGame";
import RotatedTile from "@obidos/model/src/tile/RotatedTile";
import { Side } from "@obidos/model/src/tile/Side";
import { Tile } from "@obidos/model/src/tile/Tile";
import wu from "wu";

import ConsoleRenderer from "../../src/renderer/ConsoleRenderer";

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
      expect(renderer(new ConsoleRenderer(7), defaultTiles.U)).toStrictEqual([
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
      expect(renderer(new ConsoleRenderer(5), defaultTiles.X)).toStrictEqual([
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
      expect(renderer(new ConsoleRenderer(7), defaultTiles.A)).toStrictEqual([
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
      expect(renderer(new ConsoleRenderer(7), defaultTiles.M)).toStrictEqual([
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
      expect(renderer(new ConsoleRenderer(9), defaultTiles.F)).toStrictEqual([
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
      expect(renderer(new ConsoleRenderer(9), defaultTiles.I)).toStrictEqual([
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

  describe("renderBoard", () => {
    it("renders two pieces correctly", () => {
      const board = new Board(Tile().throughRoad(Side.EAST, Side.WEST).build());
      board.add(
        0,
        1,
        new RotatedTile(
          Tile().city(Side.NORTH, Side.EAST, Side.SOUTH).road(Side.WEST).build(),
        ),
      );
      expect(new ConsoleRenderer(7).renderBoard(board)).toStrictEqual([
        "┏━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┓",
        "┃              ┃🏠🏠🏠🏠🏠🏠🏠┃",
        "┃              ┃  🏠🏠🏠🏠🏠🏠┃",
        "┃              ┃  🏠🏠🏠🏠🏠🏠┃",
        "╪══════════════╪══🏠🏠🏠🏠🏠🏠┃",
        "┃              ┃  🏠🏠🏠🏠🏠🏠┃",
        "┃              ┃  🏠🏠🏠🏠🏠🏠┃",
        "┃              ┃🏠🏠🏠🏠🏠🏠🏠┃",
        "┗━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━┛",
      ]);
    });

    it("renders three pieces correctly", () => {
      const board = new Board(Tile().throughRoad(Side.EAST, Side.SOUTH).build());
      board.add(
        0,
        1,
        new RotatedTile(
          Tile().city(Side.NORTH, Side.EAST, Side.SOUTH).road(Side.WEST).build(),
        ),
      );
      board.add(1, 0, new RotatedTile(Tile().cloister().road(Side.NORTH).build()));
      board.add(1, 1, new RotatedTile(Tile().city(Side.NORTH, Side.EAST).build()));
      expect(new ConsoleRenderer(7).renderBoard(board)).toStrictEqual([
        "┏━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┓",
        "┃              ┃🏠🏠🏠🏠🏠🏠🏠┃",
        "┃              ┃  🏠🏠🏠🏠🏠🏠┃",
        "┃              ┃  🏠🏠🏠🏠🏠🏠┃",
        "┃        ══════╪══🏠🏠🏠🏠🏠🏠┃",
        "┃      ││      ┃  🏠🏠🏠🏠🏠🏠┃",
        "┃      ││      ┃  🏠🏠🏠🏠🏠🏠┃",
        "┃      ││      ┃🏠🏠🏠🏠🏠🏠🏠┃",
        "┣━━━━━━┥┝━━━━━━╋━━━━━━━━━━━━━━┫",
        "┃      ││      ┃  🏠🏠🏠🏠🏠🏠┃",
        "┃      ││      ┃    🏠🏠🏠🏠🏠┃",
        "┃      ││      ┃      🏠🏠🏠🏠┃",
        "┃      ⛪      ┃        🏠🏠🏠┃",
        "┃              ┃          🏠🏠┃",
        "┃              ┃            🏠┃",
        "┃              ┃              ┃",
        "┗━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━┛",
      ]);
    });

    it("renders possible moves", () => {
      const board = new Board(Tile().throughRoad(Side.EAST, Side.SOUTH).build());
      board.add(
        0,
        1,
        new RotatedTile(
          Tile().city(Side.NORTH, Side.EAST, Side.SOUTH).road(Side.WEST).build(),
        ),
      );
      board.add(1, 0, new RotatedTile(Tile().cloister().road(Side.NORTH).build()));
      board.add(1, 1, new RotatedTile(Tile().city(Side.NORTH, Side.EAST).build()));

      const positions = wu(
        board.freeLocationsForTile(Tile().throughRoad(Side.NORTH, Side.SOUTH).build()),
      )
        .map(([row, col]) => [row, col] as const)
        .toArray();

      expect(positions).toStrictEqual([
        [-1, 0],
        [0, -1],
        [1, -1],
        [2, 0],
        [2, 1],
      ]);
      expect(new ConsoleRenderer(7).renderBoard(board, positions)).toStrictEqual([
        "",
        "",
        "",
        "",
        "                      1",
        "",
        "",
        "",
        "               ┏━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┓",
        "               ┃              ┃🏠🏠🏠🏠🏠🏠🏠┃",
        "               ┃              ┃  🏠🏠🏠🏠🏠🏠┃",
        "               ┃              ┃  🏠🏠🏠🏠🏠🏠┃",
        "       2       ┃        ══════╪══🏠🏠🏠🏠🏠🏠┃",
        "               ┃      ││      ┃  🏠🏠🏠🏠🏠🏠┃",
        "               ┃      ││      ┃  🏠🏠🏠🏠🏠🏠┃",
        "               ┃      ││      ┃🏠🏠🏠🏠🏠🏠🏠┃",
        "               ┣━━━━━━┥┝━━━━━━╋━━━━━━━━━━━━━━┫",
        "               ┃      ││      ┃  🏠🏠🏠🏠🏠🏠┃",
        "               ┃      ││      ┃    🏠🏠🏠🏠🏠┃",
        "               ┃      ││      ┃      🏠🏠🏠🏠┃",
        "       3       ┃      ⛪      ┃        🏠🏠🏠┃",
        "               ┃              ┃          🏠🏠┃",
        "               ┃              ┃            🏠┃",
        "               ┃              ┃              ┃",
        "               ┗━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━┛",
        "",
        "",
        "",
        "                      4              5",
        "",
        "",
        "",
        "",
      ]);
    });
  });
});
