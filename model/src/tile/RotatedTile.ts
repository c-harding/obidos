import { Side } from "./Side";
import type { Tile } from "./Tile";
import type { TileCity } from "./TileCity";
import type { TileRoad } from "./TileRoad";
import { TileRoadType } from "./TileRoad";
import type TileSide from "./TileSide";

export default class RotatedTile implements Tile {
  constructor(
    public readonly tile: Tile,
    public readonly orientation: Side = Side.NORTH,
  ) {
    if (tile instanceof RotatedTile) {
      return new RotatedTile(tile.tile, Side.rotate(tile.orientation, orientation));
    }
  }

  #roads?: readonly TileRoad[];
  get roads(): readonly Readonly<TileRoad>[] {
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
  get cities(): readonly Readonly<TileCity>[] {
    return (this.#cities ??= Object.freeze(
      this.tile.cities.map(({ walls, ...rest }) => ({
        walls: new Set([...walls].map((side) => this.rotate(side))),
        ...rest,
      })),
    ));
  }

  side(side: Side): TileSide {
    return this.tile.side(this.unrotate(side));
  }

  get cloister(): boolean {
    return this.tile.cloister;
  }

  private rotate(side: Side): Side {
    return Side.rotate(side, this.orientation);
  }

  private unrotate(side: Side): Side {
    return Side.unrotate(side, this.orientation);
  }
}
