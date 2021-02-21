import prompts from "prompts";
import wu from "wu";

import ConsoleRenderer from "@obidos/cli-player/src/renderer/ConsoleRenderer";
import type { PositionWithSide, PositionWithSides } from "@obidos/model/src/board/Board";
import type BoardView from "@obidos/model/src/board/BoardView";
import type Player from "@obidos/model/src/player/Player";
import type PlayerFactory from "@obidos/model/src/player/PlayerFactory";
import type PlayerView from "@obidos/model/src/player/PlayerView";
import RotatedTile from "@obidos/model/src/tile/RotatedTile";
import type { Side } from "@obidos/model/src/tile/Side";
import type { Tile } from "@obidos/model/src/tile/Tile";
import { range } from "@obidos/model/src/util/iteration";

export class CliPlayer implements Player {
  static readonly factory: PlayerFactory = {
    makePlayer(player: PlayerView, board: BoardView): CliPlayer {
      return new CliPlayer(player, board);
    },
  };

  renderer: ConsoleRenderer;

  constructor(private readonly player: PlayerView, private readonly board: BoardView) {
    this.renderer = new ConsoleRenderer(7);
  }

  private perRow(count: number): number {
    const scale = this.renderer.scale;
    const tileSize = 2 * scale + 4; // border plus gap
    const terminalCols = process.stdout.columns;

    const max = Math.min(count, Math.floor(terminalCols / tileSize));
    const rowCount = Math.ceil(count / max);
    for (const tileCols of range(max - 1, 0, -1)) {
      if (Math.ceil(count / tileCols) > rowCount) return tileCols + 1;
    }
    return 1;
  }

  private printRotations(tile: Tile, choices: Side[]): void {
    const perRow = this.perRow(choices.length);

    const tileSize = 2 * this.renderer.scale + 2;

    for (const row of wu(choices).chunk(perRow)) {
      const grids = row.map((rotation, i) => [
        "",
        ...this.renderer.renderTile(new RotatedTile(tile, rotation), `${i + 1}`),
      ]);
      for (const i of range(grids[0].length)) {
        console.log(grids.map((grid) => grid[i].padEnd(tileSize)).join("  "));
      }
    }
  }

  async makeMove(tile: Tile, validMoves: PositionWithSides[]): Promise<PositionWithSide> {
    const validPositions = validMoves.map(([row, col, _sides]) => [row, col] as const);

    console.log("Board:");
    console.log(this.renderer.renderBoard(this.board, validPositions).join("\n"));

    console.log("Tile:");
    console.log(this.renderer.renderTile(tile).join("\n"));

    const chosenPosition: number = (
      await prompts({
        type: "number",
        name: "chosenPosition",
        message: "Which position do you choose?",
        min: 1,
        max: validMoves.length,
      })
    ).chosenPosition;

    if (!chosenPosition) throw new Error("No position chosen");

    const [row, col, [...sides]] = validMoves[chosenPosition - 1];

    let side: Side | undefined;
    if (sides.length > 1) {
      this.printRotations(tile, sides);
      side = (
        await prompts({
          type: "number",
          name: "side",
          message: "Which rotation do you choose?",
          min: 1,
          max: sides.length,
        })
      ).side;

      if (!side) return this.makeMove(tile, validMoves);
    } else {
      [side] = sides;
    }

    return [row, col, side];
  }
}
