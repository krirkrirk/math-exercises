export const mdCodeToLatex = (text: string) => {
  let res = text;
  //finds things that starts with ``` and ends with ```
  const re = /```[\s\S]*?```/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) != null) {
    const content = match[0]
      .replaceAll("```", "")
      .split("\n")
      .filter((n) => !!n)
      .join("\n");

    res =
      res.slice(0, match.index) +
      `\\hspace{1cm} \\begin{lstlisting} \n` +
      content +
      "\\end{lstlisting} \n" +
      res.slice(match.index + match[0].length);
  }
  return res;
};
