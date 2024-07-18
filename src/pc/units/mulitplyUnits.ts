import { getUnitExp, Unit } from "./unit";
import { massValues } from "./massUnits";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

export class MultiplyUnit implements Unit {
  leftChild: Unit;
  rightChild: Unit;
  unit: string;

  constructor(leftChild: Unit, rightChild: Unit) {
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.unit = getMultipliedUnitString(this.leftChild, this.rightChild);
  }
  convert?: ((unit: string) => number) | undefined;

  toTex(): string {
    return this.toTree()
      .simplify({ keepPowers: true })
      .toTex({ forceDotSign: true });
    if (
      this.rightChild.className() === this.leftChild.className() &&
      this.rightChild.getUnit() !== this.leftChild.getUnit()
    ) {
      throw new Error(
        `Cannot multiply ${this.leftChild.getUnit()} and ${this.rightChild.getUnit()} if a converter is not provided.`,
      );
    }
    const multipliedUnits = this.unit;

    return multipliedUnits;
  }

  toTree(): AlgebraicNode {
    return new MultiplyNode(this.leftChild.toTree(), this.rightChild.toTree());
  }

  getUnit(): string {
    return this.unit;
  }

  className(): string {
    return "MultiplyUnit";
  }
}

const getMultipliedUnitString = (leftUnit: Unit, rightUnit: Unit): string => {
  const rightChildWithoutExp: string = rightUnit.toTex().split("^")[0];
  const leftChildWithoutExp: string = leftUnit.toTex().split("^")[0];
  const rightChildExp: number = getUnitExp(rightUnit);
  const leftChildExp: number = getUnitExp(leftUnit);

  if (rightChildWithoutExp === leftChildWithoutExp) {
    return `${rightUnit.toTex()}^{${rightChildExp + leftChildExp}}`;
  }
  return `${leftUnit.toTex()} \\cdot ${rightUnit.toTex()}`;
};
