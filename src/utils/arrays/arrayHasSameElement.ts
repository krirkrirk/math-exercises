export function arrayHasSameElements<E>(arr1: E[], arr2: E[]): boolean {
  return (
    arr1.length === arr2.length &&
    arr1.every((element) => arr2.includes(element))
  );
}
