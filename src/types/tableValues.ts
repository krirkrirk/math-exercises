export type TableValues = {
  lineNames: string[];
  columnNames: string[];
  values: string[][];
};

export function TableValuesConstructor(
  lineNames: string[],
  columnNames: string[],
  values: string[][],
): TableValues {
  return {
    lineNames,
    columnNames,
    values,
  };
}
