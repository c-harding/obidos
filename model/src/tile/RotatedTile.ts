import { Side } from "./Side";
import { Tile } from "./Tile";
import { TileCity } from "./TileCity";
import { TileRoad, TileRoadType } from "./TileRoad";

export default class RotatedTile {
  readonly tile: Tile;
  readonly orientation: Side;

  constructor(tile: Tile, orientation: Side = Side.NORTH) {
    this.tile = tile;
    this.orientation = orientation;
  }

  #roads?: readonly TileRoad[];
  roads(): readonly Readonly<TileRoad>[] {
    return (this.#roads ??= Object.freeze(
      this.tile.roads.map((tile) => {
        if (tile.type === TileRoadType.END) {
          return Object.freeze({
            type: TileRoadType.END,
            source: this.rotate(tile.source),
          });
        } else {
          return Object.freeze({
            type: TileRoadType.THROUGH,
            source: this.rotate(tile.source),
            destination: this.rotate(tile.destination),
          });
        }
      }),
    ));
  }

  #cities?: readonly TileCity[];
  cities(): readonly Readonly<TileCity>[] {
    return (this.#cities ??= Object.freeze(
      this.tile.cities.map(({ walls, ...rest }) => ({
        walls: new Set([...walls].map((side) => this.rotate(side))),
        ...rest,
      })),
    ));
  }

  private rotate(side: Side): Side {
    return Side.rotate(side, this.orientation);
  }
}
