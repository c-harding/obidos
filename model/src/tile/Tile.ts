import wu, { zip } from "wu";

import FrozenArrayBuilder from "../board/FrozenArrayBuilder";
import RotatedTile from "./RotatedTile";
import { Side } from "./Side";
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

  // TODO: make these private
  export function sortCities(tile: Tile): TileCity[] {
    return tile.cities
      .slice()
      .sort((a, b) => Math.min(...a.walls) - Math.min(...b.walls));
  }
  export function sortRoads(tile: Tile): Side[][] {
    return tile.roads
      .slice()
      .map((road) => TileRoad.toSides(road).sort((a, b) => a - b))
      .sort((a, b) => Math.min(...a) - Math.min(...b));
  }

  export function tileCitiesEqual(city1: TileCity, city2: TileCity): boolean {
    return (
      city1.pendant === city2.pendant &&
      city1.walls.size === city2.walls.size &&
      wu(city1.walls).every((wall) => city2.walls.has(wall))
    );
  }

  export function sidesEqual(side1: Side, side2: Side): boolean {
    return side1 === side2;
  }

  export const arraysEqual = <T>(comparator: (item1: T, item2: T) => boolean) => (
    array1: T[],
    array2: T[],
  ): boolean => {
    return (
      array1.length === array2.length &&
      zip(array1, array2).every(([item1, item2]) => comparator(item1, item2))
    );
  };

  export function uniqueRotations(tile: Tile): Set<Side> {
    type SortedTile = { side: Side; cities: TileCity[]; roads: Side[][] };

    const sorteds: SortedTile[] = [];

    for (const side of Side.values) {
      const rotatedTile = new RotatedTile(tile, side);
      const sorted = {
        side,
        cities: sortCities(rotatedTile),
        roads: sortRoads(rotatedTile),
      };
      if (
        !sorteds.find(
          (existingSortedTile) =>
            arraysEqual(arraysEqual(sidesEqual))(
              existingSortedTile.roads,
              sorted.roads,
            ) && arraysEqual(tileCitiesEqual)(existingSortedTile.cities, sorted.cities),
        )
      ) {
        sorteds.push(sorted);
      }
    }
    return new Set(wu(sorteds).map((sorted) => sorted.side));
  }
}
