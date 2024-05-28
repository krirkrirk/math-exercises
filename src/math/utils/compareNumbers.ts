export function compareNumbers(
  nb1: number | "+infini" | "-infini",
  nb2: number | "+infini" | "-infini",
) {
  if (typeof nb1 === "number" && typeof nb2 === "number") return nb1 < nb2;
}
