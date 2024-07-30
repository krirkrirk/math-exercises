import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { Unit } from "./unit";

export class PowerUnit implements Unit<any> {
  leftChild: Unit<any>;
  rightChild: NumberNode;
  unit: string;

  constructor(leftChild: Unit<any>, rightChild: NumberNode) {
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.unit = leftChild.getUnit() + `^${rightChild}`;
  }

  toTex(): string {
    return this.toTree()
      .simplify({ keepPowers: true })
      .toTex({ forceDotSign: true });
  }

  toTree(): PowerNode {
    return new PowerNode(this.leftChild.toTree(), this.rightChild);
  }

  getUnit(): string {
    return this.unit;
  }

  className(): string {
    return "PowerUnit";
  }
}
