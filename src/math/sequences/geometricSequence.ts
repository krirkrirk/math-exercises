import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";
import { DecimalConstructor } from "../numbers/decimals/decimal";
import { Integer } from "../numbers/integer/integer";
import { Nombre, NumberType } from "../numbers/nombre";
import { RationalConstructor } from "../numbers/rationals/rational";
import { randint } from "../utils/random/randint";

export abstract class GeometricSequenceConstructor {
  static random(reasonType: NumberType = NumberType.Integer) {
    let reason: Nombre;
    const type =
      reasonType ??
      random([NumberType.Decimal, NumberType.Integer, NumberType.Rational]);
    switch (type) {
      case NumberType.Decimal:
        reason = DecimalConstructor.random(-9, 10);
        break;
      case NumberType.Integer:
        reason = new Integer(randint(-9, 10, [0, 1]));
        break;
      case NumberType.Rational:
        reason = RationalConstructor.randomIrreductible();
        break;
      case NumberType.Real:
        throw Error("real geometric reason not supported yet");
    }
    return new GeometricSequence(new Integer(randint(-9, 10, [0, 1])), reason);
  }
  static randomWithLimit(reasonType?: NumberType) {
    let reason: Nombre;
    const type =
      reasonType ??
      random([NumberType.Decimal, NumberType.Integer, NumberType.Rational]);

    switch (type) {
      case NumberType.Decimal:
        const precision = randint(1, 4);
        reason = coinFlip()
          ? DecimalConstructor.fromParts(
              coinFlip() ? "0" : "-0",
              DecimalConstructor.randomFracPart(precision),
            )
          : DecimalConstructor.random(1, 10);
        break;
      case NumberType.Integer:
        reason = new Integer(randint(2, 10, [0, 1]));
        break;
      case NumberType.Rational:
        reason = RationalConstructor.randomIrreductible();
        break;
      case NumberType.Real:
        throw Error("real geometric reason not supported yet");
    }
    return new GeometricSequence(new Integer(randint(-9, 10, [0, 1])), reason);
  }
}

export class GeometricSequence {
  firstTerm: Nombre;
  reason: Nombre;

  constructor(firstTerm: Nombre, reason: Nombre) {
    this.firstTerm = firstTerm;
    this.reason = reason;
  }

  getLimit() {
    if (this.reason.value <= -1) return null;
    if (this.reason.value === 1) return this.firstTerm + "";
    if (this.reason.value > 1)
      return this.firstTerm.value > 0 ? "+\\infty" : "-\\infty";
    return "0";
  }
  toTree() {
    return new MultiplyNode(
      this.firstTerm.toTree(),
      new PowerNode(this.reason.toTree(), new VariableNode("n")),
      {
        forceTimesSign: true,
      },
    );
  }
}
