export function alignTex(arr: string[][] | string) {
  let alignements = "r";
  if (typeof arr !== "string") {
    for (let i = 0; i < arr.length - 2; i++) {
      alignements += "c";
    }
  }
  alignements += "l";
  const aligned = `$$
\\def\\arraystretch{1.8}
\\begin{array}{${alignements}}
${typeof arr === "string" ? arr : arr.map((el) => el.join("&")).join(` \\\\`)}
\\end{array}
$$`;
  return aligned;
}
