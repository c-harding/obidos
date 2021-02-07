export default interface Tile {
  cities: TileCity[];
}

export interface TileCity {
  walls: Set<Side>;
}

export enum Side {
  NORTH = 1 << 0,
  EAST = 1 << 1,
  SOUTH = 1 << 2,
  WEST = 1 << 3,
}
