export function functionVariationsConstructor(
  start: number | "+infini" | "-infini",
  startSign: "-" | "+",
  end: number | "+infini" | "-infini",
  variations: { changePoint: number; sign: "+" | "-" }[],
) {
  return { start, startSign, end, variations };
}
