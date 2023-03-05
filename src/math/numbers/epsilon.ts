function getEpsilon() {
  var e = 1.0;
  while (1.0 + 0.5 * e !== 1.0) e *= 0.5;
  return e;
}

export const EPSILON = getEpsilon();
