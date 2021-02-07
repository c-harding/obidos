import FrozenArrayBuilder from "./FrozenArrayBuilder";

export interface Tile {
  readonly cities: readonly TileCity[];
  readonly roads: readonly TileRoad[];
}

class TileBuilder {
  #cities = new FrozenArrayBuilder<TileCity>();
  #roads = new FrozenArrayBuilder<TileRoad>();

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

  build(): Tile {
    return Object.freeze({
      cities: this.#cities.build(),
      roads: this.#roads.build(),
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

/**
 * A TileRoad consists of either a road from one side to another or a road from a side or a road
 * ending on the tile.
 */
export type TileRoad =
  | {
      readonly type: TileRoadType.THROUGH;
      readonly source: Side;
      readonly destination: Side;
    }
  | {
      readonly type: TileRoadType.END;
      readonly source: Side;
      readonly destination?: undefined;
    };

export enum TileRoadType {
  THROUGH,
  END,
}

/**
 * A TileCity consists of a list of tiles, and optionally a pendant.
 */
export interface TileCity {
  walls: Set<Side>;
  pendant: boolean;
}

export enum Side {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export namespace Side {
  export function rotate(basis: Side, by: Side): Side {
    return (basis + by) % 4;
  }
}
