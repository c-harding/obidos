import FrozenArrayBuilder from "../board/FrozenArrayBuilder";
import type { Side } from "./Side";
import type { TileCity } from "./TileCity";
import { TileRoad, TileRoadType } from "./TileRoad";
import TileSide from "./TileSide";

export interface Tile {
  readonly cities: readonly TileCity[];
  readonly roads: readonly TileRoad[];
  readonly cloister: boolean;

  side(side: Side): TileSide;
}

/**
 * Build a tile
 *
 * E.g. Tile().city(Side.NORTH, SIDE.EAST).throughRoad(Side.SOUTH, Side.WEST).build()
 */
export function Tile(): Tile.Builder {
  return new Tile.Builder();
}

export namespace Tile {
  class ConcreteTile implements Tile {
    constructor(
      readonly cities: readonly TileCity[],
      readonly roads: readonly TileRoad[],
      readonly cloister: boolean,
    ) {}

    side(side: Side): TileSide {
      if (this.roads.some((road) => TileRoad.toSides(road).includes(side))) {
        return TileSide.ROAD;
      } else if (this.cities.some((city) => city.walls.has(side))) {
        return TileSide.CITY;
      } else return TileSide.FIELD;
    }
  }

  export class Builder {
    #cities = new FrozenArrayBuilder<TileCity>();
    #roads = new FrozenArrayBuilder<TileRoad>();
    #cloister = false;

    city(...sides: Side[]): this {
      this.#cities.push({
        walls: new Set(sides),
        pendant: false,
      });
      return this;
    }

    pendantCity(...sides: Side[]): this {
      this.#cities.push(
        Object.freeze({
          walls: new Set(sides),
          pendant: true,
        }),
      );
      return this;
    }

    throughRoad(source: Side, destination: Side): this {
      this.#roads.push({
        type: TileRoadType.THROUGH,
        source,
        destination,
      });
      return this;
    }

    road(source: Side): this {
      this.#roads.push(
        Object.freeze({
          type: TileRoadType.END,
          source,
        }),
      );
      return this;
    }

    cloister(): this {
      this.#cloister = true;
      return this;
    }

    build(): Tile {
      return new ConcreteTile(this.#cities.build(), this.#roads.build(), this.#cloister);
    }
  }
}
