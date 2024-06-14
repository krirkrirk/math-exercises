type GeogebraOptions = {
  isAxesRatioFixed?: boolean;
  gridDistance?: [number, number] | false;
  hideAxes?: boolean;
  hideGrid?: boolean;
  isGridBold?: boolean;
  isGridSimple?: boolean;
  isXAxesNatural?: boolean;
  axisLabels?: string[];
  is3d?: boolean;
};

type GetAdaptedCoords = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin?: number;
  zMax?: number;
  forceShowAxes?: boolean;
};

export class GeogebraConstructor {
  commands: string[];
  gridDistance: [number, number] | false;
  hideGrid: boolean;
  hideAxes: boolean;
  isGridSimple: boolean;
  isGridBold: boolean;
  is3d: boolean;
  isAxesRatioFixed: boolean;
  isXAxesNatural: boolean;
  axisLabels?: string[];
  constructor(commands: string[], options: GeogebraOptions | undefined) {
    this.commands = commands;
    this.isAxesRatioFixed = options?.isAxesRatioFixed ?? true;
    this.gridDistance = options?.gridDistance ?? [1, 1];
    this.hideGrid = options?.hideGrid ?? false;
    this.hideAxes = options?.hideAxes ?? false;
    this.isGridBold = options?.isGridBold ?? false;
    this.isGridSimple = options?.isGridSimple ?? false;
    this.isXAxesNatural = options?.isXAxesNatural ?? false;
    this.axisLabels = options?.axisLabels ?? undefined;
    this.is3d = options?.is3d ?? false;
  }

  getAdaptedCoords({
    xMin,
    xMax,
    yMin,
    yMax,
    zMin,
    zMax,
    forceShowAxes,
  }: GetAdaptedCoords) {
    const showAxes = forceShowAxes ?? this.hideAxes ? false : true;
    const xDelta = xMax - xMin;
    const yDelta = yMax - yMin;

    if (this.is3d && zMin !== undefined && zMax !== undefined) {
      const zDelta = zMax - zMin;
      const coords = [
        xMin === xMax ? xMin - 1 : xMin - Math.max(1, 0.2 * Math.abs(xDelta)),
        xMin === xMax ? xMax + 1 : xMax + Math.max(1, 0.2 * Math.abs(xDelta)),
        yMin === yMax ? yMin - 1 : yMin - Math.max(1, 0.2 * Math.abs(yDelta)),
        yMin === yMax ? yMax + 1 : yMax + Math.max(1, 0.2 * Math.abs(yDelta)),
        zMin === zMax ? zMin - 1 : zMin - Math.max(1, 0.2 * Math.abs(zDelta)),
        zMin === zMax ? zMax + 1 : zMax + Math.max(1, 0.2 * Math.abs(zDelta)),
      ];
      if (showAxes) {
        coords[0] = Math.min(-1, coords[0]);
        coords[1] = Math.max(1, coords[1]);
        coords[2] = Math.min(-1, coords[2]);
        coords[3] = Math.max(1, coords[3]);
        coords[4] = Math.min(-1, coords[4]);
        coords[5] = Math.max(1, coords[5]);
      }
      return coords;
    } else {
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
  }

  getOptions(): GeogebraOptions {
    return {
      hideAxes: this.hideAxes,
      hideGrid: this.hideGrid,
      isGridBold: this.isGridBold,
      isGridSimple: this.isGridSimple,
      gridDistance: this.gridDistance,
      isAxesRatioFixed: this.isAxesRatioFixed,
      isXAxesNatural: this.isXAxesNatural,
      axisLabels: this.axisLabels,
      is3d: this.is3d,
    };
  }
}
