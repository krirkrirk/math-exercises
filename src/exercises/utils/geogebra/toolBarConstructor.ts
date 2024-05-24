export const toolBarConstructor = (options: {
  point?: boolean;
  join?: boolean;
  parallel?: boolean;
  orthogonal?: boolean;
  intersect?: boolean;
  vector?: boolean;
  circleWithRadius: boolean;
}) => {
  let customToolBar = "0||6";
  if (options.point) customToolBar += "||1";
  if (options.join) customToolBar += "||2";
  if (options.parallel) customToolBar += "||3";
  if (options.orthogonal) customToolBar += "||4";
  if (options.intersect) customToolBar += "||5";
  if (options.vector) customToolBar += "||7";
  if (options.circleWithRadius) customToolBar += "||34";
  return customToolBar;
};
