import type { Board } from "../board/Board";
import type { Tile } from "../tile/Tile";

export default interface TileRenderer<Out = void, BoardOut = Out> {
  renderTile(tile: Tile): Out;

  renderBoard(board: Board): BoardOut;
}
