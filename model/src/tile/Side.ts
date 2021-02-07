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
