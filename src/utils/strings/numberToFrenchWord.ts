import {
  frenchTeens,
  frenchTens,
  frenchUnits,
  tenthThreePowers,
} from "./frenchNumbers";

const tensToFrench = (number: number) => {
  if (number < 10) return frenchUnits[number];
  if (number < 20) return frenchTeens[number - 10];

  const tens = Math.floor(number / 10);
  const ones = number % 10;
  const units = tens === 7 || tens === 9 ? frenchTeens : frenchUnits;
  let tenString = frenchTens[tens - 1];
  if (!ones) return tenString;
  if (tens === 7 || tens === 9) tenString = frenchTens[tens - 2];
  if (tens === 8 || tens === 9) tenString = tenString.replace("s", "");
  if (ones === 1 && tens !== 8 && tens !== 9)
    return tenString + "-et-" + units[ones];
  return tenString + "-" + units[ones];
};

const hundredsToFrench = (number: number) => {
  if (number === 100) return "cent";
  const hundreds = Math.floor(number / 100);
  const tens = number % 100;
  if (hundreds === 0) return tensToFrench(number);
  if (tens === 0) return frenchUnits[hundreds] + "-cent";
  if (hundreds === 1) return "cent-" + tensToFrench(tens);
  return frenchUnits[hundreds] + "-cent-" + tensToFrench(tens);
};

export const numberToFrenchWord = (number: number) => {
  // return hundredsToFrench(number);
  if (Math.floor(number) !== number)
    throw Error("decimal writing to french not implemented");
  const nbStr = number.toString();
  let toHundreds: number[] = [];
  let j = 0;
  let currentHundreds: string[] = [];
  const length = nbStr.length;
  const partsNumber = Math.floor((length - 1) / 3) + 1;

  for (let i = nbStr.length - 1; i >= 0; i--) {
    if (j === 3) {
      toHundreds.push(
        Number(currentHundreds.reverse().reduce((a, b) => a + b)),
      );
      currentHundreds = [];
      j = 0;
    }
    j++;
    currentHundreds.push(nbStr[i]);
  }
  toHundreds.push(Number(currentHundreds.reverse().reduce((a, b) => a + b)));
  // toHundreds.reverse();
  let res = "";
  for (let i = toHundreds.length - 1; i > -1; i--) {
    const tenthPower = i * 3;
    const hundreds = hundredsToFrench(toHundreds[i]);
    if (i === 0) {
      if (res?.length && hundreds !== "zéro") res += "-" + hundreds;
      if (!res?.length) res += hundreds;
      continue;
    }
    if (hundreds === "zéro") continue;
    const thousandWord = tenthThreePowers[i - 1];
    if (hundreds === "un" && tenthPower === 3) {
      res += (res ? "-" : "") + "mille";
    } else {
      res += (res ? "-" : "") + hundreds + "-" + thousandWord;
    }
  }
  return res;
};
