import type BoardView from "@obidos/model/src/board/BoardView";
import type Player from "@obidos/model/src/player/Player";
import type PlayerView from "@obidos/model/src/player/PlayerView";

export default interface PlayerFactory {
  makePlayer(player: PlayerView, board: BoardView): Player;
}
