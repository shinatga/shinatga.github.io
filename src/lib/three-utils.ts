import type { Vector3Tuple } from "three";

export function flipToBack(position: Vector3Tuple): Vector3Tuple {
  return [position[0], position[1], -Math.abs(position[2])];
}

export function flipToFront(position: Vector3Tuple): Vector3Tuple {
  return [position[0], position[1], Math.abs(position[2])];
}

export function clampScale(value: number, min = 0.02, max = 0.5): number {
  return Math.max(min, Math.min(max, value));
}
