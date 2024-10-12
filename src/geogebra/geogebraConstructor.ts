import { GeogebraAxisOptions, GeogebraOptions } from "#root/exercises/exercise";
import { toolBarConstructor } from "#root/exercises/utils/geogebra/toolBarConstructor";

type GetAdaptedCoords = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin?: number;
  zMax?: number;
  forceShowAxes?: boolean;
};
type GetOptionsProps = {
  coords: number[];
};
export class GeogebraConstructor {
  customToolBar?: string;
  forbidShiftDragZoom?: boolean;
  commands?: string[];
  is3D?: boolean;
  gridDistance?: [number, number] | false;
  hideGrid?: boolean;
  hideAxes?: boolean;
  isGridSimple?: boolean;
  isGridBold?: boolean;
  lockedAxesRatio?: number | false;
  xAxis?: GeogebraAxisOptions;
  yAxis?: GeogebraAxisOptions;

  constructor(options: Omit<GeogebraOptions, "coords">) {
    this.customToolBar = options?.customToolBar ?? toolBarConstructor({});
    this.forbidShiftDragZoom = options?.forbidShiftDragZoom ?? false;
    this.commands = options.commands;
    this.is3D = options?.is3D;
    this.gridDistance = options?.gridDistance ?? [1, 1];
    this.hideGrid = options?.hideGrid;
    this.hideAxes = options?.hideAxes;
    this.isGridBold = options?.isGridBold;
    this.isGridSimple = options?.isGridSimple ?? true;
    this.lockedAxesRatio = options?.lockedAxesRatio ?? 1;
    this.xAxis = options?.xAxis;
    this.yAxis = options?.yAxis;
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
    const showAxes = forceShowAxes ?? (this.hideAxes ? false : true);
    const xDelta = xMax - xMin;
    const yDelta = yMax - yMin;

    if (this.is3D && zMin !== undefined && zMax !== undefined) {
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

  getOptions({ coords }: GetOptionsProps): GeogebraOptions {
    return {
      customToolBar: this.customToolBar,
      forbidShiftDragZoom: this.forbidShiftDragZoom,
      commands: this.commands,
      coords: coords,
      is3D: this.is3D,
      gridDistance: this.gridDistance,
      hideAxes: this.hideAxes,
      hideGrid: this.hideGrid,
      isGridBold: this.isGridBold,
      isGridSimple: this.isGridSimple,
      lockedAxesRatio: this.lockedAxesRatio,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
    };
  }
}
