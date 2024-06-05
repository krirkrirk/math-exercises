export function arrayHasSameElement<T>(
  arr1: T[],
  arr2: T[],
  equalFunction: (element1: T, element2: T) => boolean,
): boolean {
  if (arr1.length !== arr2.length) return false;
  let found: boolean;
  for (let i = 0; i < arr1.length; i++) {
    found = false;
    for (let k = 0; k < arr2.length; k++) {
      if (equalFunction(arr2[k], arr1[i])) found = true;
    }
    if (!found) return false;
  }
  return true;
}
