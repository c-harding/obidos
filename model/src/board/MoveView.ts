import type { Position } from "@obidos/model/src/board/Board";
import type PlayerView from "@obidos/model/src/player/PlayerView";
import type RotatedTile from "@obidos/model/src/tile/RotatedTile";

export default interface MoveView {
  readonly player: PlayerView;
  readonly tile: RotatedTile;
  readonly position: Position;
  readonly meepleGained: boolean;

  // TODO: use a meeple here
  readonly meepleUsed: undefined;
}
