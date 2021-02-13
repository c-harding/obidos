import { zip } from "wu";

import { outerWindow, range } from "../iteration";
import RotatedTile from "../tile/RotatedTile";
import { Side } from "../tile/Side";
import type { Tile } from "../tile/Tile";
import BidiArray from "./BidiArray";

type Position = [row: number, col: number];

export class Board {
  private grid: BidiArray<BidiArray<RotatedTile>>;
  constructor(initial: Tile) {
    this.grid = new BidiArray(new BidiArray(new RotatedTile(initial, Side.NORTH)));
  }

  get(row: number, col: number): RotatedTile | undefined {
    return this.grid.get(row)?.get(col);
  }

  set<T extends RotatedTile | undefined>(row: number, col: number, tile: T): T {
    const boardRow = this.grid.get(row) ?? this.grid.set(row, new BidiArray());
    return boardRow.set(col, tile);
  }

  *freeLocations(): Generator<Position> {
    for (const [[prev, curr, next], row] of zip(
      outerWindow(this.grid, 3),
      range(this.grid.min - 1, this.grid.max + 1),
    )) {
      const min = Math.min(prev?.min ?? 0, (curr?.min ?? 0) - 1, next?.min ?? 0);
      const max = Math.max(prev?.max ?? 0, (curr?.max ?? 0) + 1, next?.max ?? 0);
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
