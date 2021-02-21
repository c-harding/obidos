import type { Side } from "@obidos/model/src/tile/Side";

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

export namespace TileRoad {
  export function toSides(road: TileRoad): Side[] {
    return road.type === TileRoadType.END
      ? [road.source]
      : [road.source, road.destination];
  }
}

export enum TileRoadType {
  THROUGH,
  END,
}
