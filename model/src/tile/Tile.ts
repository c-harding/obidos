import FrozenArrayBuilder from "../board/FrozenArrayBuilder";
import { range } from "../iteration";
import { Side } from "./Side";
import { TileCity } from "./TileCity";
import { TileRoad, TileRoadType } from "./TileRoad";

export interface Tile {
  readonly cities: readonly TileCity[];
  readonly roads: readonly TileRoad[];
  readonly cloister: boolean;
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
      return Object.freeze({
        cities: this.#cities.build(),
        roads: this.#roads.build(),
        cloister: this.#cloister,
      });
    }
  }

  const coordinatesForSide: Record<Side, [number, number]> = {
    [Side.NORTH]: [-1, 0],
    [Side.EAST]: [0, 1],
    [Side.SOUTH]: [1, 0],
    [Side.WEST]: [0, -1],
  };

  const distanceToSide = (side: Side, y: number, x: number) => {
    const [yy, xx] = coordinatesForSide[side];
    return Math.hypot(x - xx, y - yy);
  };

  export function draw(tile: Tile, scale = 7): string[] {
    const citySymbol = "🏠";
    const cloisterSymbol = "⛪";

    const canvas = Array.from(range(scale), () => Array<string>(scale).fill("  "));

    function* eachCanvasCell(): Generator<
      [y: number, x: number, setter: (value: string) => void]
    > {
      for (const row of range(scale)) {
        const y = (row + 0.5) / scale - 0.5;
        for (const col of range(scale)) {
          const x = (col + 0.5) / scale - 0.5;

          const setter = (value: string) => {
            canvas[row][col] = value;
          };

          yield [y, x, setter];
        }
      }
    }

    const midway = Math.floor((scale - 1) / 2);

    const neighbours = (first: Side, other: Side) => {
      return (first + 1) % 4 === other || first === (other + 1) % 4;
    };

    for (const road of tile.roads) {
      const roadSections =
        road.type === TileRoadType.END ? [road.source] : [road.source, road.destination];
      const isStraight =
        road.type === TileRoadType.THROUGH && !neighbours(road.source, road.destination);
      const startFrom = isStraight ? midway : midway + 1;

      for (const roadSection of roadSections)
        switch (roadSection) {
          case Side.NORTH:
            for (const row of range(0, midway)) {
              canvas[row][midway] = "||";
            }
            break;
          case Side.EAST:
            for (const col of range(startFrom, scale)) {
              canvas[midway][col] = "==";
            }
            break;
          case Side.SOUTH:
            for (const row of range(startFrom, scale)) {
              canvas[row][midway] = "||";
            }
            break;
          case Side.WEST:
            for (const col of range(0, midway)) {
              canvas[midway][col] = "==";
            }
            break;
        }
    }

    if (tile.roads.length >= 3) {
      canvas[midway][midway] = "><";
    }

    if (tile.cloister) {
      canvas[midway][midway] = cloisterSymbol;
    }

    for (const city of tile.cities) {
      const sides = [...city.walls];
      const missingSides = [Side.NORTH, Side.EAST, Side.SOUTH, Side.WEST].filter(
        (side) => !sides.includes(side),
      );
      if (sides.length === 1) {
        const [side] = sides;
        for (const [y, x, setter] of eachCanvasCell()) {
          if (distanceToSide(side, y, x) <= Math.sqrt(0.5)) {
            setter(citySymbol);
          }
        }
      } else if (sides.length === 2 && neighbours(sides[0], sides[1])) {
        for (const [y, x, setter] of eachCanvasCell()) {
          if (
            Math.min(...sides.map((side) => distanceToSide(side, y, x))) <
            Math.min(...missingSides.map((side) => distanceToSide(side, y, x)))
          ) {
            setter(citySymbol);
          }
        }
      } else {
        // city connects at least one pair of opposite sides
        for (const [y, x, setter] of eachCanvasCell()) {
          const distanceToMissingSide = Math.min(
            ...missingSides.map((side) => distanceToSide(side, y, x)),
          );
          if (distanceToMissingSide > Math.sqrt(0.5)) {
            setter(citySymbol);
          }
        }
      }
    }
    return canvas.map((row) => row.join(""));
  }
}
