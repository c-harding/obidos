import type BidiArray from "@obidos/model/src/board/BidiArray";
import type { Position, PositionWithSides } from "@obidos/model/src/board/Board";
import type RotatedTile from "@obidos/model/src/tile/RotatedTile";
import type { Tile } from "@obidos/model/src/tile/Tile";

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
