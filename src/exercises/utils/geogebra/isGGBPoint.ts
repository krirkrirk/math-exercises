export function isGGBPoint(command: string): boolean {
  const regex = /\(-?\d+(\.\d+)?,-?\d+(\.\d+)?\)/;
  return regex.test(command);
}
