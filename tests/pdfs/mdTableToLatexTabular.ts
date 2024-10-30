export const mdTableToLatexTabular = (text: string) => {
  let res = text;
  //finds things that starts with <!-- table --> and ends with <!-- !table -->
  const re = /<!-- table -->[\s\S]*?<!-- !table -->/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) != null) {
    const content = match[0]
      .replace("<!-- table -->", "")
      .replace("<!-- !table -->", "")
      .split("\n")
      .filter((n) => !!n);
    //2nd row is always |-|-|-|
    content.splice(1, 1);
    const latex = formatMarkdownRows(content);
    const tableWidth = content[0].length;
    const alignement = ("|" + "c").repeat(tableWidth) + "|";
    res =
      res.slice(0, match.index) +
      ` \\begin{center}\\begin{tabular}{${alignement}} \n \\hline ` +
      latex +
      "\\tabularnewline \\hline \\end{tabular}\\end{center} " +
      res.slice(match.index + match[0].length);
  }
  return res;
};
const formatMarkdownRows = (rows: string[]) => {
  return rows
    .map((row) => row.substring(1, row.length - 1).replaceAll("|", " & "))
    .join(" \\tabularnewline \\hline ");
};
