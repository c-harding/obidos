import { Side } from "./Side";

/**
 * A TileCity consists of a list of tiles, and optionally a pendant.
 */
export interface TileCity {
  walls: Set<Side>;
  pendant: boolean;
}
