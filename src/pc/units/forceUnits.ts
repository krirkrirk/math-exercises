import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import exp from "constants";
import { Measure } from "../measure/measure";
import { Unit } from "./unit";
import { BasicUnit } from "./basicUnit";

export type forceValues = "kN" | "hN" | "daN" | "N" | "dN" | "cN" | "mN";
const forces = ["kN", "hN", "daN", "N", "dN", "cN", "mN"];

export class ForceUnit extends BasicUnit {
  static readonly kN = new ForceUnit("kN");
  static readonly hN = new ForceUnit("hN");
  static readonly daN = new ForceUnit("daN");
  static readonly N = new ForceUnit("N");
  static readonly dN = new ForceUnit("dN");
  static readonly cN = new ForceUnit("cN");
  static readonly mN = new ForceUnit("mN");

  className(): string {
    return "ForceUnit";
  }

  getUnitsValues(): string[] {
    return forces;
  }
  getUnitsObjects(): Unit[] {
    return [
      ForceUnit.kN,
      ForceUnit.hN,
      ForceUnit.daN,
      ForceUnit.N,
      ForceUnit.dN,
      ForceUnit.cN,
      ForceUnit.mN,
    ];
  }
}
