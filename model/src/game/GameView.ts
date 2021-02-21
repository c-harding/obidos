import type BoardView from "@obidos/model/src/board/BoardView";
import type PlayerView from "@obidos/model/src/player/PlayerView";

export default interface GameView {
  readonly board: BoardView;
  readonly players: readonly PlayerView[];

  readonly drawPileSize: number;
}
