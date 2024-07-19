import { getUnitExp, Unit } from "./unit";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

export class MultiplyUnit implements Unit {
  leftChild: Unit;
  rightChild: Unit;
  unit: string;

  constructor(leftChild: Unit, rightChild: Unit) {
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.unit = rightChild.getUnit() + `\\cdot` + leftChild.getUnit();
  }

  toTex(): string {
    return this.toTree()
      .simplify({ keepPowers: true })
      .toTex({ forceDotSign: true });
  }

  toTree(): MultiplyNode {
    return new MultiplyNode(this.leftChild.toTree(), this.rightChild.toTree());
  }

  getUnit(): string {
    return this.unit;
  }

  className(): string {
    return "MultiplyUnit";
  }
}
