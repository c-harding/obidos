import type { PositionWithSide, PositionWithSides } from "@obidos/model/src/board/Board";
import type MoveView from "@obidos/model/src/board/MoveView";
import type { Tile } from "@obidos/model/src/tile/Tile";
import type PlayerView from "./PlayerView";

export default interface Player {
  makeMove(tile: Tile, validMoves: PositionWithSides[]): Promise<PositionWithSide>;

  onMove?(move: MoveView): void;

  onWinner?(player: Set<PlayerView>, won: boolean): void;
}
