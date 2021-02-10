import { Tile } from "../tile/Tile";
import { defaultCards } from "./DefaultGame";

function tileToStrings(id: string, tile: Tile, scale: number): string[] {
  const dashes = Array(scale + 1).join("--");
  return [
    `${id}${dashes}+`,
    ...Tile.draw(tile, scale).map((row) => `+${row}+`),
    `+${dashes}+`,
  ];
}

if (require.main === module) {
  const [, , scale = 9] = process.argv;
  for (const [id, tile] of Object.entries(defaultCards)) {
    console.log(tileToStrings(id, tile, +scale).join("\n"));
  }
}
