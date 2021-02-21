import type { PositionWithSide, PositionWithSides } from "@obidos/model/src/board/Board";
import type MoveView from "@obidos/model/src/board/MoveView";
import type PlayerView from "@obidos/model/src/player/PlayerView";
import type { Tile } from "@obidos/model/src/tile/Tile";

export default interface Player {
  makeMove(tile: Tile, validMoves: PositionWithSides[]): Promise<PositionWithSide>;

  onMove?(move: MoveView): void;

  onWinner?(player: Set<PlayerView>, won: boolean): void;
}
