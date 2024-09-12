export function alignTex(arr: string[][] | string) {
  //! le "&" avant les join sert à aligner à gauche
  //! mais ca crée un manque d'espace moche
  //! je pense qu'il faut changer d'environnement (align)
  //! utiliser un autre genre array ou equation je sais pas
  const aligned = `$$
\\begin{align*}
${
  typeof arr === "string"
    ? arr
    : arr.map((el) => "&" + el.join("&")).join(` \\\\`)
}
\\end{align*}
$$`;
  return aligned;
}
