import wu from "wu";

import type { PositionWithSides } from "@obidos/model/src/board/Board";
import { Board } from "@obidos/model/src/board/Board";
import type MoveView from "@obidos/model/src/board/MoveView";
import type Player from "@obidos/model/src/player/Player";
import type PlayerBlueprint from "@obidos/model/src/player/PlayerBlueprint";
import type PlayerView from "@obidos/model/src/player/PlayerView";
import RotatedTile from "@obidos/model/src/tile/RotatedTile";
import type { Tile } from "@obidos/model/src/tile/Tile";
import { shuffle } from "@obidos/model/src/util/random";
import { defaultDrawPile, meeplePerPlayer, startingTile } from "./DefaultGame";
import type Game from "./Game";

export default class LocalGame implements Game {
  private playerStates: PlayerState[];

  private winnerPromise?: Promise<Set<PlayerView>>;

  private board: Board;

  private drawPile: Tile[];

  constructor(playerBlueprints: readonly PlayerBlueprint[]) {
    this.board = new Board(startingTile);

    this.drawPile = shuffle(defaultDrawPile.slice());

    this.playerStates = playerBlueprints.map((playerBlueprint, id) => {
      const view: PlayerView = {
        id,
        name: playerBlueprint.name,
        get score() {
          return state.score;
        },
        get freeMeeple() {
          return state.freeMeeple;
        },
      };
      const state = {
        score: 0,
        freeMeeple: meeplePerPlayer,
        player: playerBlueprint.factory.makePlayer(view, this.board),
        view,
      };
      return state;
    });
  }

  start(): Promise<Set<PlayerView>> {
    if (this.winnerPromise !== undefined) return this.winnerPromise;
    return (this.winnerPromise = this.playGame());
  }

  private async playGame(): Promise<Set<PlayerView>> {
    let winner: Set<PlayerView> | undefined = undefined;
    while (winner === undefined) {
      winner = await this.round();
    }
    return winner;
  }

  private async round(): Promise<Set<PlayerView> | undefined> {
    for (const playerState of this.playerStates) {
      let tile: Tile | undefined;
      let validMoves: PositionWithSides[];

      do {
        tile = this.drawPile.pop();
        if (tile === undefined) return this.gameOver();
        validMoves = [...this.board.freeLocationsForTile(tile)];
      } while (validMoves.length === 0);

      const [row, col, side] = await playerState.player.makeMove(tile, validMoves);
      const rotatedTile = new RotatedTile(tile, side);
      this.board.add(row, col, rotatedTile);
      const move: MoveView = {
        meepleGained: false,
        meepleUsed: undefined,
        player: playerState.view,
        position: [row, col],
        tile: rotatedTile,
      };

      for (const playerState of this.playerStates) {
        playerState.player.onMove?.(move);
      }
    }
  }

  private gameOver(): Set<PlayerView> {
    const maxScore = Math.max(...this.playerStates.map((state) => state.score));
    const winningPlayers = new Set(
      wu(this.playerStates)
        .filter((state) => state.score === maxScore)
        .map((state) => state.view),
    );
    for (const playerState of this.playerStates) {
      playerState.player.onWinner?.(winningPlayers, winningPlayers.has(playerState.view));
    }
    return winningPlayers;
  }
}

interface PlayerState {
  score: number;
  freeMeeple: number;
  view: PlayerView;
  player: Player;
}
