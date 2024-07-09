import { Unit } from "./unit";

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
    if (this.rightChild.className === this.leftChild.className) {
      throw new Error(
        `Cannot divide ${this.leftChild.getUnit()} and ${this.rightChild.getUnit()} if a converter is not provided.`,
      );
    }
    return `${this.leftChild.toTex()} \\cdot ${this.rightChild.toTex()}^{-1}`;
  }
  getUnit(): string {
    return this.unit;
  }

  className(): string {
    return "DivideUnit";
  }
}
