import { randint } from '#root/math/utils/random/randint';

export const randomEnumValue = (e: any) => {
  const randIndex = randint(0, Object.keys(e).length / 2);
  return e[randIndex];
};
