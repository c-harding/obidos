import { Tile } from "../tile/Tile";
import { defaultCards } from "./DefaultGame";

export function tileToStrings(id: string, tile: Tile, scale: number): string[] {
  const dashes = Array(scale + 1).join("--");
  return [
    `${id}${dashes}+`,
    ...Tile.draw(tile, scale).map((row) => `|${row}|`),
    `+${dashes}+`,
  ];
}

export function printAllDefaultCards(scale: number): void {
  for (const [id, tile] of Object.entries(defaultCards)) {
    console.log(tileToStrings(id, tile, +scale).join("\n"));
  }
}

if (require.main === module) {
  const [, , scale = 9] = process.argv;
  printAllDefaultCards(+scale);
}
