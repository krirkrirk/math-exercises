import { randomLetter } from "#root/utils/strings/randomLetter";

export const randomSegmentName = () => {
  const A = randomLetter(true);
  const B = randomLetter(true, [A]);
  return `${A}${B}`;
};
