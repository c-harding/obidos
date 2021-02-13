import RotatedTile from "../../src/tile/RotatedTile";
import { Side } from "../../src/tile/Side";
import { Tile } from "../../src/tile/Tile";
import type { TileCity } from "../../src/tile/TileCity";
import type { TileRoad } from "../../src/tile/TileRoad";
import { TileRoadType } from "../../src/tile/TileRoad";

describe("RotatedTile", () => {
  const cityNES = Tile().city(Side.NORTH, Side.EAST, Side.SOUTH).build();
  const cloister = Tile().cloister().road(Side.SOUTH).build();
  const roadAndCity = Tile()
    .pendantCity(Side.SOUTH)
    .throughRoad(Side.EAST, Side.WEST)
    .build();

  it("returns exactly the original sides when not rotated", () => {
    const notRotated = new RotatedTile(cityNES);
    expect(notRotated.cities).toContainEqual<TileCity>({
      pendant: false,
      walls: new Set([Side.NORTH, Side.EAST, Side.SOUTH]),
    });
  });

  it("returns exactly the original sides when rotated", () => {
    const rotated = new RotatedTile(cityNES, Side.EAST);
    expect(rotated.cities).toContainEqual<TileCity>({
      pendant: false,
      walls: new Set([Side.WEST, Side.EAST, Side.SOUTH]),
    });
  });

  it("returns a cloister rotated properly", () => {
    const rotatedCloister = new RotatedTile(cloister, Side.EAST);
    expect(rotatedCloister.cities).toHaveLength(0);
    expect(rotatedCloister.cloister).toBe(true);
    expect(rotatedCloister.roads).toStrictEqual<TileRoad[]>([
      {
        type: TileRoadType.END,
        source: Side.WEST,
      },
    ]);
  });

  it("returns everything rotated properly", () => {
    const rotatedRoadAndCity = new RotatedTile(roadAndCity, Side.WEST);
    expect(rotatedRoadAndCity.cities).toContainEqual<TileCity>({
      pendant: true,
      walls: new Set([Side.EAST]),
    });
    expect(rotatedRoadAndCity.cloister).toBe(false);
    expect(rotatedRoadAndCity.roads).toStrictEqual<TileRoad[]>([
      {
        type: TileRoadType.THROUGH,
        source: Side.NORTH,
        destination: Side.SOUTH,
      },
    ]);
  });

  it("caches computed properties of tiles", () => {
    const rotatedRoadAndCity = new RotatedTile(roadAndCity, Side.WEST);
    expect(rotatedRoadAndCity.cities).toBe(rotatedRoadAndCity.cities);
    expect(rotatedRoadAndCity.roads).toBe(rotatedRoadAndCity.roads);
  });
});
