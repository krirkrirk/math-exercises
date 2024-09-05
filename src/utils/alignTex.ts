export function alignTex(arr: string[][] | string) {
  const aligned = `$$
\\begin{align*}
${typeof arr === "string" ? arr : arr.map((el) => el.join("&")).join(` \\\\`)}
\\end{align*}
$$`;
  return aligned;
}
