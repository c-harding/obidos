import wu from "wu";

import { CliPlayer } from "@obidos/cli-player/src/player/CliPlayer";
import LocalGame from "@obidos/model/src/game/LocalGame";

async function runCliGame(): Promise<void> {
  const game = new LocalGame([{ factory: CliPlayer.factory, name: "CLI Player" }]);

  const winners = await game.start();

  console.log(
    winners.size === 1 ? "Winner:" : "Winners:",
    wu(winners)
      .map((winner) => winner.name)
      .toArray()
      .join(", "),
  );
}

if (require.main === module) {
  runCliGame().catch((error) => {
    console.error("An error occurred:", error);
  });
}
