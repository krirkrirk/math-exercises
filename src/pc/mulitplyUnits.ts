import { Unit } from "./unit";

export class MultiplyUnit implements Unit {
  leftChild: Unit;
  rightChild: Unit;
  unit: string;

  constructor(leftChild: Unit, rightChild: Unit) {
    this.unit = leftChild.getUnit() + rightChild.getUnit();
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }

  toTex(): string {
    if (this.rightChild.getUnit() === this.leftChild.getUnit()) {
      return `${this.rightChild.toTex()}^2`;
    }
    if (this.rightChild.className() === this.leftChild.className()) {
      throw new Error(
        `Cannot multiply ${this.leftChild.getUnit()} and ${this.rightChild.getUnit()} if a converter is not provided.`,
      );
    }
    return `${this.leftChild.toTex()} \\cdot ${this.rightChild.toTex()}`;
  }

  getUnit(): string {
    return this.unit;
  }

  className(): string {
    return "MultiplyUnit";
  }
}
