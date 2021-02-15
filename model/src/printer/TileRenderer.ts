import type BoardView from "../board/BoardView";
import type { Tile } from "../tile/Tile";

export default interface TileRenderer<Out = void, BoardOut = Out> {
  renderTile(tile: Tile): Out;

  renderBoard(board: BoardView): BoardOut;
}
