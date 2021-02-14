import wu, { zip } from "wu";

import { outerWindow, range } from "../iteration";
import MemoizedProp from "../memoizedProp";
import RotatedTile from "../tile/RotatedTile";
import { Side } from "../tile/Side";
import type { Tile } from "../tile/Tile";
import BidiArray from "./BidiArray";

export type Position = readonly [row: number, col: number];
export type PositionWithSides = readonly [row: number, col: number, side: Set<Side>];

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

  private offsetLocation([row, col]: Position, side: Side): Position {
    switch (side) {
      case Side.NORTH:
        return [row - 1, col];
      case Side.EAST:
        return [row, col + 1];
      case Side.SOUTH:
        return [row + 1, col];
      case Side.WEST:
        return [row, col - 1];
    }
  }

  pieceFits(row: number, col: number, tile: RotatedTile): boolean {
    for (const side of Side.values) {
      const neighbour = this.get(...this.offsetLocation([row, col], side));
      if (neighbour && neighbour.side(Side.opposite(side)) !== tile.side(side)) {
        return false;
      }
    }
    return true;
  }

  add(row: number, col: number, tile: RotatedTile): RotatedTile | undefined {
    if (!this.freeLocations.find(([r, c]) => row === r && col === c)) return;
    if (!this.pieceFits(row, col, tile)) return;

    const boardRow =
      this.modifiableGrid.get(row) ?? this.modifiableGrid.set(row, new BidiArray());

    this.moveNumber++;
    return boardRow.set(col, tile);
  }

  get grid(): BidiArray.Readonly<BidiArray.Readonly<RotatedTile>> {
    return this.modifiableGrid;
  }

  get minRow(): number {
    return this.grid.min;
  }

  get maxRow(): number {
    return this.grid.max;
  }

  get minCol(): number {
    return wu(this.grid)
      .map((row) => row?.min ?? +Infinity)
      .reduce(Math.min, +Infinity);
  }

  get maxCol(): number {
    return wu(this.grid)
      .map((row) => row?.max ?? -Infinity)
      .reduce(Math.max, -Infinity);
  }

  private *freeLocationGenerator(): Generator<Position> {
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

  #freeLocations = new MemoizedProp(
    () => this.moveNumber,
    () => Object.freeze([...this.freeLocationGenerator()]),
  );
  get freeLocations(): readonly Position[] {
    return this.#freeLocations.value;
  }

  *freeLocationsForTile(tile: Tile): Generator<PositionWithSides> {
    for (const [row, col] of this.freeLocations) {
      const sides = Side.values.filter((side) =>
        this.pieceFits(row, col, new RotatedTile(tile, side)),
      );

      if (sides.length !== 0) {
        yield [row, col, new Set(sides)];
      }
    }
  }
}
