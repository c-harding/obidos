import wu, { zip } from "wu";

import { outerWindow, range } from "../iteration";
import RotatedTile from "../tile/RotatedTile";
import { Side } from "../tile/Side";
import type { Tile } from "../tile/Tile";
import BidiArray from "./BidiArray";

type Position = [row: number, col: number];

export class Board {
  private modifiableGrid: BidiArray<BidiArray<RotatedTile>>;
  constructor(initial: Tile) {
    this.modifiableGrid = new BidiArray(
      new BidiArray(new RotatedTile(initial, Side.NORTH)),
    );
  }

  private moveNumber = 0;

  get(row: number, col: number): RotatedTile | undefined {
    return this.grid.get(row)?.get(col);
  }

  set<T extends RotatedTile | undefined>(row: number, col: number, tile: T): T {
    this.moveNumber++;
    const boardRow =
      this.modifiableGrid.get(row) ?? this.modifiableGrid.set(row, new BidiArray());
    return boardRow.set(col, tile);
  }

  get grid(): BidiArray.Readonly<BidiArray.Readonly<RotatedTile>> {
    return this.modifiableGrid;
  }

  get minY(): number {
    return this.grid.min;
  }

  get maxY(): number {
    return this.grid.max;
  }

  get minX(): number {
    return wu(this.grid)
      .map((row) => row?.min ?? +Infinity)
      .reduce(Math.min, +Infinity);
  }

  get maxX(): number {
    return wu(this.grid)
      .map((row) => row?.max ?? -Infinity)
      .reduce(Math.max, -Infinity);
  }

  *freeLocations(): Generator<Position> {
    for (const [[prev, curr, next], row] of zip(
      outerWindow(3)(this.grid),
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
