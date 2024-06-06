export function arrayEqual<T>(
  arr1: T[],
  arr2: T[],
  equalFunction?: (element1: T, element2: T) => boolean,
): boolean {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (equalFunction ? !equalFunction(arr1[i], arr2[i]) : arr1[i] !== arr2[i])
      return false;
  }
  return true;
}
