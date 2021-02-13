export enum Side {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export namespace Side {
  export const values = Object.freeze([Side.NORTH, Side.EAST, Side.SOUTH, Side.WEST]);

  export function rotate(basis: Side, by: Side): Side {
    return (basis + by) % Side.values.length;
  }

  export function unrotate(basis: Side, by: Side): Side {
    return (basis + Side.values.length - by) % Side.values.length;
  }

  export function opposite(basis: Side): Side {
    return rotate(basis, Side.SOUTH);
  }
}
