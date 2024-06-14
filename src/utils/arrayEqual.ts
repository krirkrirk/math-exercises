export function arrayEqual<T>(
  arr1: T[],
  arr2: T[],
  elementEqual: (element1: T, element2: T) => boolean = (el1, el2) =>
    el1 === el2,
): boolean {
  return (
    arr1.length === arr2.length &&
    arr1.every((element, index) => elementEqual(element, arr2[index]))
  );
}
