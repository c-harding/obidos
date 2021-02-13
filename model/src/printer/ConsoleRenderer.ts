import { repeat, zip } from "wu";

import type { Board } from "../board/Board";
import { defaultCards } from "../game/DefaultGame";
import { fillArray, generateArray, outerWindow, range, repeatString } from "../iteration";
import { Side } from "../tile/Side";
import type { Tile } from "../tile/Tile";
import { TileRoadType } from "../tile/TileRoad";
import type TileRenderer from "./TileRenderer";

export default class ConsoleRenderer implements TileRenderer<string[]> {
  private static coordinatesForSide: Record<Side, [number, number]> = Object.freeze({
    [Side.NORTH]: [-1, 0],
    [Side.EAST]: [0, 1],
    [Side.SOUTH]: [1, 0],
    [Side.WEST]: [0, -1],
  });

  private static distanceToSide(side: Side, y: number, x: number) {
    const [yy, xx] = this.coordinatesForSide[side];
    return Math.hypot(x - xx, y - yy);
  }

  constructor(readonly scale: number) {}

  private renderTileContents(tile: Tile): string[] {
    const scale = this.scale;

    const citySymbol = "🏠";
    const cloisterSymbol = "⛪";

    const canvas = generateArray(scale, () => fillArray(scale, "  "));

    function* eachCanvasCell(): Generator<
      [y: number, x: number, setter: (value: string) => void]
    > {
      for (const row of range(scale)) {
        const y = (row + 0.5) / scale - 0.5;
        for (const col of range(scale)) {
          const x = (col + 0.5) / scale - 0.5;

          const setter = (value: string) => {
            canvas[row][col] = value;
          };

          yield [y, x, setter];
        }
      }
    }

    const midway = Math.floor((scale - 1) / 2);

    const neighbours = (first: Side, other: Side) => {
      return (first + 1) % 4 === other || first === (other + 1) % 4;
    };

    for (const road of tile.roads) {
      const roadSections =
        road.type === TileRoadType.END ? [road.source] : [road.source, road.destination];
      const isStraight =
        road.type === TileRoadType.THROUGH && !neighbours(road.source, road.destination);
      const startFrom = isStraight ? midway : midway + 1;

      for (const roadSection of roadSections) {
        switch (roadSection) {
          case Side.NORTH:
            for (const row of range(0, midway)) {
              canvas[row][midway] = "││";
            }
            break;
          case Side.EAST:
            for (const col of range(startFrom, scale)) {
              canvas[midway][col] = "══";
            }
            break;
          case Side.SOUTH:
            for (const row of range(startFrom, scale)) {
              canvas[row][midway] = "││";
            }
            break;
          case Side.WEST:
            for (const col of range(0, midway)) {
              canvas[midway][col] = "══";
            }
            break;
        }
      }
    }

    if (tile.roads.length >= 3) {
      canvas[midway][midway] = "╳╳";
    }

    if (tile.cloister) {
      canvas[midway][midway] = cloisterSymbol;
    }

    for (const city of tile.cities) {
      const sides = [...city.walls];
      const missingSides = [Side.NORTH, Side.EAST, Side.SOUTH, Side.WEST].filter(
        (side) => !sides.includes(side),
      );
      if (sides.length === 1) {
        const [side] = sides;
        for (const [y, x, setter] of eachCanvasCell()) {
          if (ConsoleRenderer.distanceToSide(side, y, x) <= Math.sqrt(0.5)) {
            setter(citySymbol);
          }
        }
      } else if (sides.length === 2 && neighbours(sides[0], sides[1])) {
        for (const [y, x, setter] of eachCanvasCell()) {
          if (
            Math.min(...sides.map((side) => ConsoleRenderer.distanceToSide(side, y, x))) <
            Math.min(
              ...missingSides.map((side) => ConsoleRenderer.distanceToSide(side, y, x)),
            )
          ) {
            setter(citySymbol);
          }
        }
      } else {
        // city connects at least one pair of opposite sides
        for (const [y, x, setter] of eachCanvasCell()) {
          const distanceToMissingSide = Math.min(
            ...missingSides.map((side) => ConsoleRenderer.distanceToSide(side, y, x)),
          );
          if (distanceToMissingSide > Math.sqrt(0.5)) {
            setter(citySymbol);
          }
        }
      }
    }
    return canvas.map((row) => row.join(""));
  }

  renderTile(tile: Tile, label = "╋"): string[] {
    const dashes = repeatString(this.scale, "━━");
    return [
      `${label}${dashes}╋`,
      ...this.renderTileContents(tile).map((row) => `┃${row}┃`),
      `╋${dashes}╋`,
    ];
  }

  renderBoard(board: Board): string[] {
    const { minX, maxX } = board;
    const grid = range(board.minY, board.maxY)
      .map((y) => {
        return range(minX, maxX)
          .map((x) => {
            const cell = board.get(y, x);
            return cell && this.renderTileContents(cell);
          })
          .toArray();
      })
      .toArray();

    const canvas: string[] = [];
    for (const [prevRow, currRow] of outerWindow(2)(grid)) {
      const newRows: string[][] = generateArray((currRow ? this.scale : 0) + 1, () => []);
      for (const [
        [aboveLeft, left] = repeat(undefined),
        [above, curr] = repeat(undefined),
      ] of outerWindow(2)(
        zip<string[] | undefined, string[] | undefined>(
          prevRow ?? repeat(undefined),
          currRow ?? repeat(undefined),
        ),
      )) {
        const leftWall = left || curr;
        const aboveWall = above || curr;
        const topLeftWall = aboveLeft || leftWall || curr;
        const leftWallSymbol = leftWall ? "┃" : " ";
        const aboveWallSymbol = repeatString(this.scale, aboveWall ? "━━" : "  ");
        const topLeftWallSymbol = topLeftWall ? "╋" : " ";
        newRows[0].push(topLeftWallSymbol + aboveWallSymbol);
        for (const i of range(this.scale)) {
          newRows[i + 1].push(
            leftWallSymbol + (curr?.[i] ?? repeatString(this.scale, "  ")),
          );
        }
      }

      canvas.push(...newRows.join(""));
    }
    return canvas;
  }

  printAllDefaultCards(): void {
    for (const [id, tile] of Object.entries(defaultCards)) {
      console.log(this.renderTile(tile, id).join("\n"));
    }
  }

  static main([, , scale]: string[]): void {
    const renderer = new ConsoleRenderer(+(scale || "9"));
    renderer.printAllDefaultCards();
  }
}

if (require.main === module) {
  ConsoleRenderer.main(process.argv);
}
