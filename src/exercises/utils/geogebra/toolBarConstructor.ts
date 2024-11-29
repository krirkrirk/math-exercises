export const toolBarConstructor = (options: {
  point?: boolean;
  join?: boolean;
  parallel?: boolean;
  orthogonal?: boolean;
  intersect?: boolean;
  vector?: boolean;
  circleTwoPoints?: boolean;
  circleRadius?: boolean;
  segment?: boolean;
  segmentFixed?: boolean;
  polygon?: boolean;
}) => {
  let customToolBar = "0||6";
  if (options.point) customToolBar += "||1";
  if (options.join) customToolBar += "||2";
  if (options.parallel) customToolBar += "||3";
  if (options.orthogonal) customToolBar += "||4";
  if (options.intersect) customToolBar += "||5";
  if (options.vector) customToolBar += "||7";
  if (options.circleTwoPoints) customToolBar += "||10";
  if (options.segment) customToolBar += "||15";
  if (options.segmentFixed) customToolBar += "||45";
  if (options.circleRadius) customToolBar += "||34";
  if (options.polygon) customToolBar += "||16";
  return customToolBar;
};
