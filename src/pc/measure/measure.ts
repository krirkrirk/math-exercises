import { round, roundSignificant } from "#root/math/utils/round";
import { ToTexOptions } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { DivideUnits } from "../units/divideUnits";
import { MultiplyUnit } from "../units/mulitplyUnits";
import { Unit } from "../units/unit";
import { UnitConverter } from "../UnitConverter";
import { getMassUnitObjet } from "#root/exercises/utils/getUnitObjet";

export abstract class MeasureConstructor {
  static random() {}
}
export class Measure {
  exponent: number;
  significantPart: number;
  unit?: Unit;

  constructor(value: number, exponent: number = 0, unit?: Unit) {
    // console.log("bf", value, exponent);
    if (unit) this.unit = unit;
    if (value === 0) {
      this.significantPart = 0;
      this.exponent = 0;
    } else if (value >= 10) {
      const stringValue = value.toString();
      const length = stringValue.split(".")[0].length - 1;
      this.exponent = exponent + length;
      this.significantPart = Number(
        stringValue[0] + "." + stringValue.replace(".", "").slice(1),
      );
    } else if (value <= -10) {
      const stringValue = value.toString();
      const length = stringValue.split(".")[0].length - 2;
      this.exponent = exponent + length;
      this.significantPart = Number(
        "-" + stringValue[1] + "." + stringValue.replace(".", "").slice(1),
      );
    } else if (value > 0 && value < 1) {
      const stringValue = value.toString();
      const firstSignificantIndex = stringValue
        .split("")
        .findIndex((el) => el.match(/[1-9]/));
      const length = firstSignificantIndex - 1;
      this.exponent = exponent - length;
      this.significantPart = Number(
        stringValue[firstSignificantIndex] +
          "." +
          stringValue.slice(firstSignificantIndex + 1),
      );
    } else if (value > -1 && value < 0) {
      const stringValue = value.toString();
      const firstSignificantIndex = stringValue
        .split("")
        .findIndex((el) => el.match(/[1-9]/));
      const length = firstSignificantIndex - 2;
      this.exponent = exponent - length;
      this.significantPart = Number(
        "-" +
          stringValue[firstSignificantIndex] +
          "." +
          stringValue.slice(firstSignificantIndex + 1),
      );
    } else {
      this.significantPart = value;
      this.exponent = exponent;
    }
    // console.log("after", this.significantPart, this.exponent);
  }

  times(n: number | Measure, unitConverter?: UnitConverter) {
    if (typeof n === "number")
      return this.unit
        ? new Measure(this.significantPart * n, this.exponent, this.unit)
        : new Measure(this.significantPart * n, this.exponent);
    if (!this.unit) {
      return n.unit
        ? new Measure(
            this.significantPart * n.significantPart,
            this.exponent + n.exponent,
            n.unit,
          )
        : new Measure(
            this.significantPart * n.significantPart,
            this.exponent + n.exponent,
          );
    }
    if (unitConverter) {
      const thisConverted = unitConverter.convert(
        this.significantPart,
        this.exponent,
        this.unit ?? n.unit!,
      )!;
      const nConverted = unitConverter.convert(
        n.significantPart,
        n.exponent,
        n.unit ?? this.unit!,
      )!;
      return new Measure(
        this.significantPart * n.significantPart,
        thisConverted.exponent + nConverted.exponent,
        thisConverted.unit,
      );
    }
    return new Measure(
      this.significantPart * n.significantPart,
      this.exponent + n.exponent,
      n.unit ? new MultiplyUnit(this.unit, n.unit) : this.unit,
    );
  }
  divide(n: number | Measure, unitConverter?: UnitConverter) {
    if (typeof n === "number")
      return this.unit
        ? new Measure(this.significantPart / n, this.exponent, this.unit)
        : new Measure(this.significantPart / n, this.exponent);
    if (!this.unit)
      return n.unit
        ? new Measure(
            this.significantPart / n.significantPart,
            this.exponent - n.exponent,
            n.unit,
          )
        : new Measure(
            this.significantPart / n.significantPart,
            this.exponent - n.exponent,
          );
    if (unitConverter) {
      const thisConverted = unitConverter.convert(
        this.significantPart,
        this.exponent,
        this.unit ?? n.unit!,
      )!;
      const nConverted = unitConverter.convert(
        n.significantPart,
        n.exponent,
        n.unit ?? this.unit!,
      )!;
      return new Measure(
        this.significantPart / n.significantPart,
        thisConverted.exponent - nConverted.exponent,
        thisConverted.unit,
      );
    }
    return new Measure(
      this.significantPart / n.significantPart,
      this.exponent - n.exponent,
      n.unit ? new MultiplyUnit(this.unit, n.unit) : this.unit,
    );
  }

  add(n: number | Measure) {
    if (typeof n === "number") {
      const commonExponent = Math.min(this.exponent, 0);
      const scaledThis =
        this.significantPart * Math.pow(10, this.exponent - commonExponent);
      const scaledN = n * Math.pow(10, -commonExponent);
      const resultSignificant = scaledThis + scaledN;
      return this.unit
        ? new Measure(resultSignificant, commonExponent, this.unit)
        : new Measure(resultSignificant, commonExponent);
    } else {
      if ((this.unit || n.unit) && this.unit?.getUnit() !== n.getUnit())
        throw new Error(`Cannot add ${this.getUnit()} with ${n.getUnit()}`);
      const commonExponent = Math.min(this.exponent, n.exponent);
      const scaledThis =
        this.significantPart * Math.pow(10, this.exponent - commonExponent);
      const scaledN =
        n.significantPart * Math.pow(10, n.exponent - commonExponent);
      const resultSignificant = scaledThis + scaledN;
      const resultUnit = this.unit || n.unit ? this.unit ?? n.unit : undefined;
      return resultUnit
        ? new Measure(resultSignificant, commonExponent, resultUnit)
        : new Measure(resultSignificant, commonExponent);
    }
  }

  subtract(n: number | Measure) {
    if (typeof n === "number") {
      const commonExponent = Math.min(this.exponent, 0);
      const scaledThis =
        this.significantPart * Math.pow(10, this.exponent - commonExponent);
      const scaledN = n * Math.pow(10, -commonExponent);
      const resultSignificant = scaledThis - scaledN;
      return this.unit
        ? new Measure(resultSignificant, commonExponent, this.unit)
        : new Measure(resultSignificant, commonExponent);
    } else {
      if (this.unit?.getUnit() !== n.getUnit())
        throw new Error(`Cannot add ${this.getUnit()} with ${n.getUnit()}`);
      const commonExponent = Math.min(this.exponent, n.exponent);
      const scaledThis =
        this.significantPart * Math.pow(10, this.exponent - commonExponent);
      const scaledN =
        n.significantPart * Math.pow(10, n.exponent - commonExponent);
      const resultSignificant = scaledThis - scaledN;
      const resultUnit = this.unit || n.unit ? this.unit ?? n.unit : undefined;
      return resultUnit
        ? new Measure(resultSignificant, commonExponent, resultUnit)
        : new Measure(resultSignificant, commonExponent);
    }
  }

  toTex(opts?: ToTexOptions) {
    const decimals = opts?.scientific;
    const nbTree =
      decimals === undefined
        ? this.significantPart.toTree()
        : new NumberNode(
            this.significantPart,
            roundSignificant(this.significantPart, decimals),
          );
    if (this.exponent === 0) {
      return (
        nbTree.toTex() +
        `${this.unit && !opts?.hideUnit ? `\\ ${this.unit.toTex()}` : ""}`
      );
    }
    if (this.exponent === 1) {
      return (
        new MultiplyNode(nbTree, (10).toTree()).toTex({
          scientific: decimals,
        }) + `${this.unit && !opts?.hideUnit ? `\\ ${this.unit.toTex()}` : ""}`
      );
    }
    return (
      new MultiplyNode(
        nbTree,
        new PowerNode((10).toTree(), this.exponent.toTree()),
      ).toTex({ scientific: decimals }) +
      `${this.unit && !opts?.hideUnit ? `\\ ${this.unit.toTex()}` : ""}`
    );
  }

  /**
   * n = nb decimals
   */
  toSignificant(n: number) {
    return this.unit
      ? new Measure(round(this.significantPart, n), this.exponent, this.unit)
      : new Measure(round(this.significantPart, n), this.exponent);
  }

  evaluate() {
    return this.significantPart * Math.pow(10, this.exponent);
  }

  equals(m: Measure) {
    return (
      this.exponent === m.exponent && this.significantPart === m.significantPart
    );
  }

  toIdentifiers() {
    return {
      significantPart: this.significantPart,
      exponent: this.exponent,
    };
  }

  hasUnit(): boolean {
    return this.unit ? true : false;
  }

  getUnit(): string {
    if (!this.unit) {
      return "This measure has no unit";
    }
    return this.unit.getUnit();
  }

  convert(unit: string): Measure {
    if (this.unit && this.unit.convert) {
      const convertedExpo = this.unit.convert(unit);
      return new Measure(
        this.significantPart,
        this.exponent + convertedExpo,
        getMassUnitObjet(unit),
      );
    }
    throw this.unit
      ? new Error(
          `Conversion is not yet implemented for ${this.unit.className()}`,
        )
      : new Error(`Cannot convert a measure without unit.`);
  }

  setUnit(unit: Unit) {
    this.unit = unit;
  }
}
