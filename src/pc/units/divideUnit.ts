import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { isNumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { Unit } from "./interfaces/unit";

export class DivideUnit implements Unit<any> {
  leftChild: Unit<any>;
  rightChild: Unit<any>;
  unit: string;

  constructor(leftChild: Unit<any>, rightChild: Unit<any>) {
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.unit = leftChild.getUnit() + "/" + rightChild.getUnit();
  }
  toTex(): string {
    const resultTree = this.toTree().simplify({ keepPowers: true });
    if (isNumberNode(resultTree) && resultTree.value === 1) {
      return "";
    }
    return resultTree.toTex({ forceDotSign: true });
  }

  toTree(): AlgebraicNode {
    return new MultiplyNode(
      this.leftChild.toTree(),
      new PowerNode(this.rightChild.toTree(), (-1).toTree()).simplify({
        keepPowers: true,
      }),
    );
  }

  getUnit(): string {
    return this.unit;
  }

  className(): string {
    return "DivideUnit";
  }
}
