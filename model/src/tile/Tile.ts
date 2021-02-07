import FrozenArrayBuilder from "../board/FrozenArrayBuilder";
import { Side } from "./Side";
import { TileCity } from "./TileCity";
import { TileRoad, TileRoadType } from "./TileRoad";

export interface Tile {
  readonly cities: readonly TileCity[];
  readonly roads: readonly TileRoad[];
  readonly cloister: boolean;
}

class TileBuilder {
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
    return Object.freeze({
      cities: this.#cities.build(),
      roads: this.#roads.build(),
      cloister: this.#cloister,
    });
  }
}

/**
 * Build a tile
 *
 * E.g. Tile().city(Side.NORTH, SIDE.EAST).throughRoad(Side.SOUTH, Side.WEST).build()
 */
export function Tile(): TileBuilder {
  return new TileBuilder();
}
