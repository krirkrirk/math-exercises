import { Node } from '../tree/nodes/node';
import { random } from '../utils/random';
import { remarkableTrigoValues } from './remarkableValues';

export abstract class RemarkableValueConstructor {
  static mainInterval = () => {
    const randValue = random(remarkableTrigoValues);
    return new RemarkableValue(randValue.angle, randValue.cos, randValue.sin);
  };
}

export class RemarkableValue {
  angle: Node;
  cos: Node;
  sin: Node;
  constructor(angle: Node, cos: Node, sin: Node) {
    this.angle = angle;
    this.cos = cos;
    this.sin = sin;
  }
}
