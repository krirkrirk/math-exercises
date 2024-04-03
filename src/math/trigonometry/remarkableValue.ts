import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { random } from "#root/utils/random";
import { Integer } from "../numbers/integer/integer";
import { NumberType } from "../numbers/nombre";
import { Rational } from "../numbers/rationals/rational";

import { randint } from "../utils/random/randint";
import { RemarkableValue, remarkableTrigoValues } from "./remarkableValues";

export abstract class RemarkableValueConstructor {
  static mainInterval = (): RemarkableValue => {
    const randValue = random(remarkableTrigoValues);
    return randValue;
  };
  static simplifiable = (): RemarkableValue & {
    mainAngle: AlgebraicNode;
  } => {
    const index = randint(0, remarkableTrigoValues.length);
    const randValue = remarkableTrigoValues[index];
    const toAdd = randint(-3, 4) * 2;
    const newRadian = new AddNode(
      randValue.angle,
      new MultiplyNode(new NumberNode(toAdd), PiNode),
    ).simplify();
    return {
      mainAngle: randValue.angle,
      angle: newRadian,
      cos: randValue.cos,
      sin: randValue.sin,
      point: randValue.point,
      degree: randValue.degree,
    };
  };
}
