export function isGGBPoint(command: string): boolean {
  const regex = /\(-?\d+;-?\d+\)/;
  return regex.test(command);
}
