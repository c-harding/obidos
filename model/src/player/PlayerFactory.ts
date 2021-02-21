import type BoardView from "@obidos/model/src/board/BoardView";
import type Player from "./Player";
import type PlayerView from "./PlayerView";

export default interface PlayerFactory {
  makePlayer(player: PlayerView, board: BoardView): Player;
}
