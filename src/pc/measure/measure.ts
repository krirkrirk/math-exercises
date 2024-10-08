import { frenchify } from "#root/math/utils/latex/frenchify";
import { round, roundSignificant } from "#root/math/utils/round";
import { ToTexOptions } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { DivideUnit } from "../units/divideUnit";
import { Unit } from "../units/interfaces/unit";
import { MultiplyUnit } from "../units/mulitplyUnits";

export abstract class MeasureConstructor {
  static random() {}
}
export class Measure<T extends string = string> {
  exponent: number;
  significantPart: number;
  unit?: Unit<T>;

  constructor(value: number, exponent: number = 0, unit?: Unit<T>) {
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
      const stringValue = value.toString().substring(1);
      const length = stringValue.split(".")[0].length - 1;
      this.exponent = exponent + length;
      this.significantPart = Number(
        "-" + stringValue[0] + "." + stringValue.replace(".", "").slice(1),
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

  times(n: number | Measure<any>) {
    if (typeof n === "number")
      return this.unit
        ? new Measure(this.significantPart * n, this.exponent, this.unit)
        : new Measure(this.significantPart * n, this.exponent);
    if (this.unit && n.unit) {
      return new Measure(
        this.significantPart * n.significantPart,
        this.exponent + n.exponent,
        new MultiplyUnit(this.unit, n.unit),
      );
    }
    return new Measure(
      this.significantPart * n.significantPart,
      this.exponent + n.exponent,
      this.unit ?? n.unit,
    );
  }
  divide(n: number | Measure<any>) {
    if (typeof n === "number")
      return new Measure(this.significantPart / n, this.exponent, this.unit);
    if (this.unit && n.unit)
      return new Measure(
        this.significantPart / n.significantPart,
        this.exponent - n.exponent,
        new DivideUnit(this.unit, n.unit),
      );
    return new Measure(
      this.significantPart / n.significantPart,
      this.exponent - n.exponent,
      this.unit ?? n.unit,
    );
  }

  add(n: number | Measure<T>) {
    if (typeof n === "number") {
      const commonExponent = Math.min(this.exponent, 0);
      const scaledThis =
        this.significantPart * Math.pow(10, this.exponent - commonExponent);
      const scaledN = n * Math.pow(10, -commonExponent);
      const resultSignificant = scaledThis + scaledN;
      return new Measure(resultSignificant, commonExponent, this.unit);
    } else {
      const commonExponent = Math.min(this.exponent, n.exponent);
      const scaledThis =
        this.significantPart * Math.pow(10, this.exponent - commonExponent);
      const scaledN =
        n.significantPart * Math.pow(10, n.exponent - commonExponent);
      const resultSignificant = scaledThis + scaledN;
      return new Measure(
        resultSignificant,
        commonExponent,
        this.unit ?? n.unit,
      );
    }
  }

  subtract(n: number | Measure<T>) {
    if (typeof n === "number") {
      const commonExponent = Math.min(this.exponent, 0);
      const scaledThis =
        this.significantPart * Math.pow(10, this.exponent - commonExponent);
      const scaledN = n * Math.pow(10, -commonExponent);
      const resultSignificant = scaledThis - scaledN;
      return new Measure(resultSignificant, commonExponent, this.unit);
    } else {
      const commonExponent = Math.min(this.exponent, n.exponent);
      const scaledThis =
        this.significantPart * Math.pow(10, this.exponent - commonExponent);
      const scaledN =
        n.significantPart * Math.pow(10, n.exponent - commonExponent);
      const resultSignificant = scaledThis - scaledN;
      return new Measure(
        resultSignificant,
        commonExponent,
        this.unit ?? n.unit,
      );
    }
  }

  toTex(opts?: ToTexOptions) {
    let tex = "";
    const decimals = opts?.scientific;
    const nbTree =
      decimals === undefined
        ? this.significantPart.toTree()
        : new NumberNode(
            this.significantPart,
            roundSignificant(this.significantPart, decimals),
          );
    if (opts?.notScientific) {
      tex = this.toNotScientificTex();
    } else if (this.exponent === 0) {
      tex = nbTree.toTex();
    } else if (this.exponent === 1) {
      tex = new MultiplyNode(nbTree, (10).toTree()).toTex({
        scientific: decimals,
      });
    } else {
      tex = new MultiplyNode(
        nbTree,
        new PowerNode((10).toTree(), this.exponent.toTree()),
      ).toTex({ scientific: decimals });
    }
    return (
      tex + `${this.unit && !opts?.hideUnit ? `\\ ${this.unit.toTex()}` : ""}`
    );
  }
  private toNotScientificTex() {
    if (this.exponent === 0) return frenchify(this.significantPart);
    let result = (this.significantPart + "").replace(".", "").replace("-", "");
    if (this.exponent > 0) {
      for (let n = result.length; n <= this.exponent; n++) {
        result += 0;
      }
      if (this.exponent < result.length - 1 && this.exponent !== 0) {
        result = `${result.substring(0, this.exponent + 1)},${result.slice(
          this.exponent + 1,
        )}`;
      }
    }
    if (this.exponent < 0) {
      for (let n = 0; n < Math.abs(this.exponent); n++) {
        result = 0 + result;
      }
      result = `${result[0]},${result.slice(1)}`;
    }
    return this.significantPart < 0 ? "-" + result : result;
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

  equals(m: Measure<T>) {
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

  getUnit(): Unit<T> {
    if (!this.unit) {
      throw new Error("This measure has no unit");
    }
    return this.unit;
  }

  convert(unit: T): Measure<T> {
    if (this.unit && this.unit.convert) {
      return this.unit.convert(this.significantPart, this.exponent, unit);
    }
    throw this.unit
      ? new Error(
          `Conversion is not yet implemented for ${this.unit.className()}`,
        )
      : new Error(`Cannot convert a measure without unit.`);
  }

  setUnit(unit: Unit<any>) {
    this.unit = unit;
  }

  getValueAsNumber(): number {
    if (Math.abs(this.exponent) > 14)
      throw new Error(
        `Cannot represent ${this.toTex({ hideUnit: true })} as a number.`,
      );
    return Math.pow(10, this.exponent) * this.significantPart;
  }
}
