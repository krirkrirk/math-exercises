import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { random } from "#root/utils/random";
import { Integer } from "../numbers/integer/integer";
import { NumberType } from "../numbers/nombre";
import { Rational } from "../numbers/rationals/rational";

import { randint } from "../utils/random/randint";
import { remarkableTrigoValues } from "./remarkableValues";

export interface RemarkableValue {
  angleValue: Integer | Rational;
  angle: Node;
  cos: Node;
  sin: Node;
}

export abstract class RemarkableValueConstructor {
  static mainInterval = (): RemarkableValue => {
    const randValue = random(remarkableTrigoValues);
    return randValue;
    // return new RemarkableValue(randValue.angle, randValue.cos, randValue.sin);
  };

  static simplifiable = (): RemarkableValue & { index: number } => {
    const index = randint(0, remarkableTrigoValues.length);
    const randValue = remarkableTrigoValues[index];
    const isInt = randValue.angleValue.type === NumberType.Integer;
    const toAdd = randint(-3, 4) * 2;
    const newRadian = isInt
      ? new Integer((randValue.angleValue as Integer).value + toAdd)
      : (new Rational(
          (randValue.angleValue as Rational).num,
          (randValue.angleValue as Rational).denum,
        ).add(new Integer(toAdd)) as Rational);
    const newAngle = isInt
      ? new MultiplyNode(new NumberNode(newRadian.value), PiNode)
      : new FractionNode(
          new MultiplyNode(new NumberNode((newRadian as Rational).num), PiNode),
          new NumberNode((newRadian as Rational).denum),
        );
    return {
      angleValue: newRadian,
      angle: newAngle,
      cos: randValue.cos,
      sin: randValue.sin,
      index,
    };
  };
}
