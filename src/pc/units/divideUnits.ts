import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { isNumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { isPowerNode, PowerNode } from "#root/tree/nodes/operators/powerNode";
import { getUnitExp, Unit } from "./unit";

export class DivideUnits implements Unit {
  leftChild: Unit;
  rightChild: Unit;
  unit: string;

  constructor(leftChild: Unit, rightChild: Unit) {
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.unit = leftChild.getUnit() + "/" + rightChild.getUnit();
  }
  convert?: ((unit: string) => number) | undefined;

  toTex(): string {
    const resultTree = this.toTree().simplify();
    if (isNumberNode(resultTree) && resultTree.value === 1) {
      return "";
    }
    /*if (this.rightChild.getUnit() === this.leftChild.getUnit()) {
      return ``;
    }
    const rightChildExp = getUnitExp(this.rightChild);
    return `${this.leftChild.toTex()} \\cdot ${
      this.rightChild.toTex().split("^")[0]
    }^{${-rightChildExp}}`;*/
    return resultTree.toTex({ forceDotSign: true });
  }

  toTree(): AlgebraicNode {
    return new MultiplyNode(
      this.leftChild.toTree(),
      new PowerNode(this.rightChild.toTree(), (-1).toTree()),
    );
  }

  getUnit(): string {
    return this.unit;
  }

  className(): string {
    return "DivideUnit";
  }
}
