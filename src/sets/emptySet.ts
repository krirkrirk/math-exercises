import { MathSetInterface } from "./mathSetInterface";

export abstract class EmptySet implements MathSetInterface {
  tex: string = "\\emptyset";
  getRandomElement = () => Number.NaN;
}
