import type BoardView from "@obidos/model/src/board/BoardView";
import type { Tile } from "@obidos/model/src/tile/Tile";

export default interface TileRenderer<Out = void, BoardOut = Out> {
  renderTile(tile: Tile): Out;

  renderBoard(board: BoardView): BoardOut;
}
