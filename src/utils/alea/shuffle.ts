/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffle<T>(array: T[]): T[] {
  const res = [...array];
  for (var i = res.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = res[i];
    res[i] = res[j];
    res[j] = temp;
  }
  return res;
}
