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

  toTex(): string {
    if (this.rightChild.getUnit() === this.leftChild.getUnit()) {
      return ``;
    }
    const rightChildExp = getUnitExp(this.rightChild);
    return `${this.leftChild.toTex()} \\cdot ${
      this.rightChild.toTex().split("^")[0]
    }^{${-rightChildExp}}`;
  }
  getUnit(): string {
    return this.unit;
  }

  className(): string {
    return "DivideUnit";
  }
}
