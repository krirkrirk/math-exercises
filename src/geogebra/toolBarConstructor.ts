export abstract class ToolBarConstructor {
  static custom(options: {
    point?: boolean;
    join?: boolean;
    parallel?: boolean;
    orthogonal?: boolean;
    intersect?: boolean;
  }): string {
    let customToolBar = "0";
    if (options.point) customToolBar += " 1";
    if (options.join) customToolBar += " 2";
    if (options.parallel) customToolBar += " 3";
    if (options.orthogonal) customToolBar += " 4";
    if (options.intersect) customToolBar += " 5";
    return customToolBar;
  }

  static default() {
    return "0|1|2";
  }
}
