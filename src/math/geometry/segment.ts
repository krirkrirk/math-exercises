import { Point } from "./point";

export class Segment {
  pointA: Point;
  pointB: Point;
  constructor(pointA: Point, pointB: Point) {
    this.pointA = pointA;
    this.pointB = pointB;
  }
  getLength() {
    return this.pointA.distanceTo(this.pointB);
  }
  getName() {
    return `\\left[${this.pointA.name}, ${this.pointB.name}\\right]`;
  }
  //   toGGBCommands(){
  //     return `Segment(${},${})`
  //   }
}
