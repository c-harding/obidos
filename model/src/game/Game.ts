import type PlayerView from "../player/PlayerView";

interface Game {
  start(): Promise<Set<PlayerView>>;
}

export default Game;
