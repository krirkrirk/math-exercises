const rowBuilder = (row: (string | number)[]) => {
  return "|" + row.join("|") + "|";
};

export const mdTable = (rows: (string | number)[][]) => {
  const width = rows[0].length;
  return `
<!-- table -->
${rowBuilder(rows[0])}
${rowBuilder(new Array(width).fill("-"))}
${rows.slice(1).map(rowBuilder).join("\n")}
<!-- !table -->
`;
};
