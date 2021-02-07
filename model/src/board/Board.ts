import BidiArray from "./BidiArray";
import RotatedTile from "../tile/RotatedTile";
import { Tile } from "../tile/Tile";
import { zip } from "wu";
import { Side } from "../tile/Side";
import { outerWindow, range } from "../iteration";

type Position = [row: number, col: number];

export class Board {
  private grid: BidiArray<BidiArray<RotatedTile>>;
  constructor(initial: Tile) {
    this.grid = new BidiArray(
      new BidiArray(new RotatedTile(initial, Side.NORTH)),
    );
  }

  get(row: number, col: number): RotatedTile | undefined {
    return this.grid.get(row)?.get(col);
  }

  *freeLocations(): Generator<Position> {
    for (const [[prev, curr, next], row] of zip(
      outerWindow(this.grid, 3),
      range(this.grid.min - 1, this.grid.max + 1),
    )) {
      const min = Math.min(
        prev?.min ?? 0,
        (curr?.min ?? 0) - 1,
        next?.min ?? 0,
      );
      const max = Math.max(
        prev?.max ?? 0,
        (curr?.max ?? 0) + 1,
        next?.max ?? 0,
      );
      for (const col of range(min, max)) {
        if (curr?.get(col)) continue;
        const verticalNeighbours = prev?.get(col) || next?.get(col);
        const horizontalNeighbours = curr?.get(col - 1) || curr?.get(col + 1);
        if (verticalNeighbours || horizontalNeighbours) {
          yield [row, col];
        }
      }
    }
  }
}
