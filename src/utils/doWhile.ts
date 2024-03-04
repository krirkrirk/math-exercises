export function doWhile<T>(exec: () => T, whileTrue: (x: T) => boolean) {
  let res: T;
  do {
    res = exec();
  } while (whileTrue(res));
  return res;
}
