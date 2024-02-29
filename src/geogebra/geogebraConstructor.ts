type GeogebraOptions = {
  isAxesRatioFixed?: boolean;
  gridDistance?: [number, number] | false;
  hideAxes?: boolean;
  hideGrid?: boolean;
  isGridBold?: boolean;
  isGridSimple?: boolean;
};

type GetAdaptedCoords = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  forceShowAxes?: boolean;
};

export class GeogebraConstructor {
  commands: string[];
  gridDistance: [number, number] | false;
  hideGrid: boolean;
  hideAxes: boolean;
  isGridSimple: boolean;
  isGridBold: boolean;
  isAxesRatioFixed: boolean;
  constructor(commands: string[], options: GeogebraOptions | undefined) {
    this.commands = commands;
    this.isAxesRatioFixed = options?.isAxesRatioFixed ?? true;
    this.gridDistance = options?.gridDistance ?? [1, 1];
    this.hideGrid = options?.hideGrid ?? false;
    this.hideAxes = options?.hideAxes ?? false;
    this.isGridBold = options?.isGridBold ?? false;
    this.isGridSimple = options?.isGridSimple ?? false;
  }

  getAdaptedCoords({
    xMin,
    xMax,
    yMin,
    yMax,
    forceShowAxes,
  }: GetAdaptedCoords) {
    const showAxes = forceShowAxes ?? this.hideAxes ? false : true;
    const xDelta = xMax - xMin;
    const yDelta = yMax - yMin;
    const coords = [
      xMin === xMax ? xMin - 1 : xMin - Math.max(1, 0.2 * Math.abs(xDelta)),
      xMin === xMax ? xMax + 1 : xMax + Math.max(1, 0.2 * Math.abs(xDelta)),
      yMin === yMax ? yMin - 1 : yMin - Math.max(1, 0.2 * Math.abs(yDelta)),
      yMin === yMax ? yMax + 1 : yMax + Math.max(1, 0.2 * Math.abs(yDelta)),
    ];
    if (showAxes) {
      coords[0] = Math.min(-1, coords[0]);
      coords[1] = Math.max(1, coords[1]);
      coords[2] = Math.min(-1, coords[2]);
      coords[3] = Math.max(1, coords[3]);
    }
    return coords;
  }

  getOptions(): GeogebraOptions {
    return {
      hideAxes: this.hideAxes,
      hideGrid: this.hideGrid,
      isGridBold: this.isGridBold,
      isGridSimple: this.isGridSimple,
      gridDistance: this.gridDistance,
      isAxesRatioFixed: this.isAxesRatioFixed,
    };
  }
}
