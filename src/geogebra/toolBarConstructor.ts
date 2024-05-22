export const toolBarConstructor = (options: {
  point?: boolean;
  join?: boolean;
  parallel?: boolean;
  orthogonal?: boolean;
  intersect?: boolean;
}) => {
  let customToolBar = "0";
  if (options.point) customToolBar += " 1";
  if (options.join) customToolBar += " 2";
  if (options.parallel) customToolBar += " 3";
  if (options.orthogonal) customToolBar += " 4";
  if (options.intersect) customToolBar += " 5";
  return customToolBar;
};
