import { randint } from '../mathutils/random/randint';
import { Node } from '../tree/nodes/node';
import { NumberNode } from '../tree/nodes/numbers/numberNode';
import { PiNode } from '../tree/nodes/numbers/piNode';
import { AddNode } from '../tree/nodes/operators/addNode';
import { MultiplyNode } from '../tree/nodes/operators/multiplyNode';
import { simplifyNode } from '../tree/parsers/simplify';
import { random } from '../utils/random';
import { remarkableTrigoValues } from './remarkableValues';

export interface RemarkableValue {
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

  static simplifiable = (): RemarkableValue => {
    const randValue = random(remarkableTrigoValues);
    const toAdd = new MultiplyNode(new NumberNode(randint(-3, 4) * 2), PiNode);
    const newAngle = simplifyNode(new AddNode(randValue.angle, toAdd));
    return {
      angle: newAngle,
      cos: randValue.cos,
      sin: randValue.sin,
    };
  };
}
