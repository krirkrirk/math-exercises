import { random } from './random';

export const diceFlip = (faces: number) => {
  const arr = [];
  for (let i = 0; i < faces; i++) {
    arr.push(i);
  }
  return random(arr);
};
