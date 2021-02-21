import type PlayerView from "@obidos/model/src/player/PlayerView";

interface Game {
  start(): Promise<Set<PlayerView>>;
}

export default Game;
