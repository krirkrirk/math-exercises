export function alignTex(arr: string[][] | string, noLatexSigns = false) {
  let alignements = "r";
  if (typeof arr !== "string" && arr[0].length > 2) {
    for (let i = 0; i < arr[0].length - 2; i++) {
      alignements += "c";
    }
  }
  alignements += "l";
  const aligned = `${!noLatexSigns ? "$$" : ""}
\\def\\arraystretch{1.8}
\\begin{array}{${alignements}}
${typeof arr === "string" ? arr : arr.map((el) => el.join("&")).join(` \\\\`)}
\\end{array}
${!noLatexSigns ? "$$" : ""}`;
  return aligned;
}
