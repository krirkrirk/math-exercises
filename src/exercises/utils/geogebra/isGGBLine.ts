export function isGGBLine(command: string): boolean {
  const regex = /Line\([A-Z],\s[A-Z]\)/;
  return regex.test(command);
}
