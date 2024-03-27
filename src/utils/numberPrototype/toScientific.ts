import { round, roundSignificant } from "#root/math/utils/round";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";

export const toScientific = function (
  value: number,
  decimals?: number,
): AlgebraicNode {
  if (value === Infinity || value === -Infinity)
    throw Error("can't turn infinty into scientific");
  const [intPart, fracPart] = value.toString().split(".");
  if (!fracPart) {
    let nb = "";
    let power = 0;
    if (value < 0) {
      power = intPart.length - 2;
      nb += "-" + intPart[1] + "." + intPart.slice(2);
    } else {
      power = intPart.length - 1;
      nb += intPart[0] + "." + intPart.slice(1);
    }
    let nbValue = Number(nb);
    if (decimals !== undefined) {
      nbValue = round(nbValue, decimals);
      if (nbValue >= 10) {
        nbValue = 1;
        power++;
      } else if (nbValue <= -10) {
        nbValue = -1;
        power++;
      }
    }
    if (power === 0) return nbValue.toTree();
    return new MultiplyNode(
      new NumberNode(
        nbValue,
        decimals !== undefined
          ? roundSignificant(nbValue, decimals)
          : undefined,
      ),
      power === 1
        ? (10).toTree()
        : new PowerNode((10).toTree(), power.toTree()),
    );
  } else {
    if (Number(intPart) === 0) {
      const firstSignificantIndex = fracPart
        .split("")
        .findIndex((el) => el !== "0");
      if (firstSignificantIndex === -1) return value.toTree();
      const leadingZeros = firstSignificantIndex + 1;
      let power = -leadingZeros;
      let nbValue = Number(
        (value < 0 ? "-" : "") +
          fracPart[firstSignificantIndex] +
          "." +
          fracPart.slice(firstSignificantIndex + 1),
      );
      if (decimals !== undefined) {
        nbValue = round(nbValue, decimals);
      }
      if (nbValue >= 10) {
        nbValue = 1;
        power++;
      } else if (nbValue <= -10) {
        nbValue = -1;
        power++;
      }
      if (power === 0) return nbValue.toTree();
      return new MultiplyNode(
        new NumberNode(
          nbValue,
          decimals !== undefined
            ? roundSignificant(nbValue, decimals)
            : undefined,
        ),
        power === 1
          ? (10).toTree()
          : new PowerNode((10).toTree(), power.toTree()),
      );
    } else {
      let nb = "";
      let power = 0;

      if (value < 0) {
        const remainingIntPart = intPart.slice(2);
        nb += "-" + intPart[1] + "." + remainingIntPart + fracPart;
        power = remainingIntPart.length;
      } else {
        const remainingIntPart = intPart.slice(1);
        nb += intPart[0] + "." + remainingIntPart + fracPart;
        power = remainingIntPart.length;
      }
      let nbValue = Number(nb);
      if (decimals !== undefined) {
        nbValue = round(nbValue, decimals);
      }
      if (nbValue >= 10) {
        nbValue = 1;
        power++;
      } else if (nbValue <= -10) {
        nbValue = -1;
        power++;
      }
      if (power === 0) return nbValue.toTree();
      return new MultiplyNode(
        new NumberNode(
          nbValue,
          decimals !== undefined
            ? roundSignificant(nbValue, decimals)
            : undefined,
        ),
        power === 1
          ? (10).toTree()
          : new PowerNode((10).toTree(), power.toTree()),
      );
    }
  }
};
