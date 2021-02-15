import type { PositionWithSide, PositionWithSides } from "../board/Board";
import type MoveView from "../board/MoveView";
import type { Tile } from "../tile/Tile";
import type PlayerView from "./PlayerView";

export default interface Player {
  makeMove(tile: Tile, validMoves: PositionWithSides[]): Promise<PositionWithSide>;

  onMove?(move: MoveView): void;

  onWinner?(player: Set<PlayerView>, won: boolean): void;
}
