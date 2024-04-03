import { round, roundSignificant } from "#root/math/utils/round";
import { ToTexOptions } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";

export class Measure {
  exponent: number;
  significantPart: number;

  constructor(value: number, exponent: number = 0) {
    // console.log("bf", value, exponent);
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

  times(n: number | Measure) {
    if (typeof n === "number")
      return new Measure(this.significantPart * n, this.exponent);
    return new Measure(
      this.significantPart * n.significantPart,
      this.exponent + n.exponent,
    );
  }
  divide(n: number | Measure) {
    if (typeof n === "number")
      return new Measure(this.significantPart / n, this.exponent);
    return new Measure(
      this.significantPart / n.significantPart,
      this.exponent - n.exponent,
    );
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
      return nbTree.toTex();
    }
    if (this.exponent === 1) {
      return new MultiplyNode(nbTree, (10).toTree()).toTex({
        scientific: decimals,
      });
    }
    return new MultiplyNode(
      nbTree,
      new PowerNode((10).toTree(), this.exponent.toTree()),
    ).toTex({ scientific: decimals });
  }

  /**
   * n = nb decimals
   */
  toSignificant(n: number) {
    return new Measure(round(this.significantPart, n), this.exponent);
  }

  //gravité = 9.32423432
  //new Measure(9432432).toSignificant(1).times(39)

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
}
