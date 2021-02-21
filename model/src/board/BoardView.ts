import type RotatedTile from "@obidos/model/src/tile/RotatedTile";
import type { Tile } from "@obidos/model/src/tile/Tile";
import type BidiArray from "./BidiArray";
import type { Position, PositionWithSides } from "./Board";

export default interface BoardView {
  readonly grid: BidiArray.Readonly<BidiArray.Readonly<RotatedTile>>;

  readonly minRow: number;
  readonly maxRow: number;
  readonly minCol: number;
  readonly maxCol: number;

  readonly freeLocations: readonly Position[];

  get(row: number, col: number): RotatedTile | undefined;

  pieceFits(row: number, col: number, tile: RotatedTile): boolean;

  freeLocationsForTile(tile: Tile): Generator<PositionWithSides>;
}
