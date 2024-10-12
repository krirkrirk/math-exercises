import { randint } from "#root/math/utils/random/randint";
import { random } from "./random";

export const diceFlip = (faces: number) => {
  return randint(1, faces + 1);
};
