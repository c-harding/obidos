import type PlayerView from "../player/PlayerView";
import type RotatedTile from "../tile/RotatedTile";
import type { Position } from "./Board";

export default interface MoveView {
  readonly player: PlayerView;
  readonly tile: RotatedTile;
  readonly position: Position;
  readonly meepleGained: boolean;

  // TODO: use a meeple here
  readonly meepleUsed: undefined;
}
