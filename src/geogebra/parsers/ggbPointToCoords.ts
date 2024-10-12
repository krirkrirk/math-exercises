export const ggbPointToCoords = (point: string) => {
  const [x, y] = point
    .replace("(", "")
    .replace(")", "")
    .split(",")
    .map(parseFloat);
  return { x, y };
};
