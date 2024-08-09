import { BaseTenUnit } from "./interfaces/baseTenUnit";
import { Unit } from "./interfaces/unit";

type molValues = "kmol" | "hmol" | "damol" | "mol" | "dmol" | "cmol" | "mmol";

const mol: molValues[] = [
  "kmol",
  "hmol",
  "damol",
  "mol",
  "dmol",
  "cmol",
  "mmol",
];

export class AmountOfSubstance extends BaseTenUnit<molValues> {
  static readonly kmol = new AmountOfSubstance("kmol");
  static readonly hmol = new AmountOfSubstance("hmol");
  static readonly damol = new AmountOfSubstance("damol");
  static readonly mol = new AmountOfSubstance("mol");
  static readonly dmol = new AmountOfSubstance("dmol");
  static readonly cmol = new AmountOfSubstance("cmol");
  static readonly mmol = new AmountOfSubstance("mmol");

  className(): string {
    return "AmountOfSubstance";
  }
  getUnitsValues(): string[] {
    return mol;
  }
  getUnitsObjects(): Unit<molValues>[] {
    return [
      AmountOfSubstance.kmol,
      AmountOfSubstance.hmol,
      AmountOfSubstance.damol,
      AmountOfSubstance.mol,
      AmountOfSubstance.dmol,
      AmountOfSubstance.cmol,
      AmountOfSubstance.mmol,
    ];
  }
}
