import { Measure } from "../measure/measure";
import { BasicUnit } from "./basicUnit";

export type timeValues = "h" | "mi" | "s" | "ms";

const times = ["h", "mi", "s", "ms"];
const timesValue = [1 / 60, 1, 60, 60000];

export class TimeUnit extends BasicUnit<timeValues> {
  static readonly h = new TimeUnit("h");
  static readonly mi = new TimeUnit("mi");
  static readonly s = new TimeUnit("s");
  static readonly ms = new TimeUnit("ms");

  className(): string {
    return "TimeUnit";
  }

  convert(
    significantPart: number,
    exponent: number,
    convertToUnit: string,
  ): Measure<timeValues> {
    const timeObjects = [TimeUnit.h, TimeUnit.mi, TimeUnit.s, TimeUnit.ms];
    const unitIndex = times.findIndex((value) => convertToUnit === value);
    if (!times.includes(convertToUnit))
      throw new Error(`cannot convert ${this.toTex()} to ${convertToUnit}.`);
    let convertedSignificantPart = this.convertToMinute(significantPart);
    if (convertToUnit !== "mi") {
      convertedSignificantPart =
        timesValue[unitIndex] * convertedSignificantPart;
    }
    return new Measure(significantPart, exponent, timeObjects[unitIndex]);
  }

  convertToMinute(significantPart: number): number {
    switch (this.unit) {
      case "h":
        return significantPart * 60;
      case "mi":
        return significantPart;
      case "s:":
        return significantPart / 60;
      case "ms":
        return significantPart / 60000;
    }
    return 0;
  }
}
