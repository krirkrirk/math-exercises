import { Unit } from "./interfaces/unit";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

export class MultiplyUnit implements Unit<any> {
  leftChild: Unit<any>;
  rightChild: Unit<any>;
  unit: string;

  constructor(leftChild: Unit<any>, rightChild: Unit<any>) {
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.unit = rightChild.getUnit() + `\\cdot` + leftChild.getUnit();
  }
  className(): string {
    return "MultiplyUnit";
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
}
