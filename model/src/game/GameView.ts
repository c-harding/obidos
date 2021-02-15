import type BoardView from "../board/BoardView";
import type PlayerView from "../player/PlayerView";

export default interface GameView {
  readonly board: BoardView;
  readonly players: readonly PlayerView[];

  readonly drawPileSize: number;
}
