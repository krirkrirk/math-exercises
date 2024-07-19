import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import exp from "constants";
import { Measure } from "../measure/measure";
import { Unit } from "./unit";

export type forceValues = "kN" | "hN" | "daN" | "N" | "dN" | "cN" | "mN";
const forces = ["kN", "hN", "daN", "N", "dN", "cN", "mN"];

export class ForceUnit implements Unit {
  static readonly kN = new ForceUnit("kN");
  static readonly hN = new ForceUnit("hN");
  static readonly daN = new ForceUnit("daN");
  static readonly N = new ForceUnit("N");
  static readonly dN = new ForceUnit("dN");
  static readonly cN = new ForceUnit("cN");
  static readonly mN = new ForceUnit("mN");

  unit: forceValues;

  constructor(unit: forceValues) {
    this.unit = unit;
  }
  toTree(): AlgebraicNode {
    return new VariableNode(this.unit);
  }

  className(): string {
    return "ForceUnit";
  }

  toTex(): string {
    return `\\text{${this.unit}}`;
  }

  getUnit(): string {
    return this.unit;
  }

  convert(
    significantPart: number,
    exponent: number,
    convertToUnit: string,
  ): Measure {
    const forcesObjects = [
      ForceUnit.kN,
      ForceUnit.hN,
      ForceUnit.daN,
      ForceUnit.N,
      ForceUnit.dN,
      ForceUnit.cN,
      ForceUnit.mN,
    ];
    if (!forces.includes(convertToUnit))
      throw new Error(`${convertToUnit} is not recognized as a unit.`);
    const thisUnitIndex = forces.findIndex((value) => this.unit === value);
    const unitIndex = forces.findIndex((value) => convertToUnit === value);
    const resultIndex = unitIndex - thisUnitIndex;
    return new Measure(
      significantPart,
      exponent + resultIndex,
      forcesObjects[resultIndex],
    );
  }
}
