import type { PositionWithSide, PositionWithSides } from "@obidos/model/src/board/Board";
import type BoardView from "@obidos/model/src/board/BoardView";
import type Player from "@obidos/model/src/player/Player";
import type PlayerFactory from "@obidos/model/src/player/PlayerFactory";
import type PlayerView from "@obidos/model/src/player/PlayerView";
import { Side } from "@obidos/model/src/tile/Side";
import type { Tile } from "@obidos/model/src/tile/Tile";
import type { Choice } from "prompts";
import prompts from "prompts";

import ConsoleRenderer from "../renderer/ConsoleRenderer";

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

    if (chosenPosition === undefined) throw new Error("No position chosen");

    const [row, col, sides] = validMoves[chosenPosition - 1];

    const rotationChoices: { title: string; value: Side | string }[] = [
      { title: "As displayed", value: Side.NORTH },
      { title: "Rotated 90°", value: Side.EAST },
      { title: "Rotated 180°", value: Side.SOUTH },
      { title: "Rotated 270°", value: Side.WEST },
    ].filter(({ value }) => sides.has(value));

    let side: Side;
    if (rotationChoices.length > 1) {
      side = (
        await prompts({
          type: "select",
          name: "side",
          message: "Which way around do you choose?",
          choices: rotationChoices as Choice[],
        })
      ).side;

      if (side === undefined) throw new Error("No side chosen");
    } else {
      [side] = sides;
    }

    return [row, col, side];
  }
}
