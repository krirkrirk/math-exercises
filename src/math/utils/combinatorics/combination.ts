import { factorial } from "../arithmetic/factorial";

export const combinations = (k: number, n: number): number => {
  return factorial(n) / (factorial(k) * factorial(n - k));
};
