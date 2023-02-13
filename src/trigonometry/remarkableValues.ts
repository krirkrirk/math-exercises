import { SqrtNode } from '../tree/nodes/functions/sqrtNode';
import { NumberNode } from '../tree/nodes/numbers/numberNode';
import { PiNode } from '../tree/nodes/numbers/piNode';
import { FractionNode } from '../tree/nodes/operators/fractionNode';

export const remarkableTrigoValues = [
  {
    angle: new NumberNode(0),
    cos: new NumberNode(1),
    sin: new NumberNode(0),
  },
  {
    angle: new FractionNode(PiNode, new NumberNode(6)),
    cos: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    sin: new FractionNode(new NumberNode(1), new NumberNode(2)),
  },
  {
    angle: new FractionNode(PiNode, new NumberNode(4)),
    cos: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    sin: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
  },
  {
    angle: new FractionNode(PiNode, new NumberNode(3)),
    cos: new FractionNode(new NumberNode(1), new NumberNode(2)),
    sin: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
  },
  {
    angle: new NumberNode(1),
    cos: new NumberNode(0),
    sin: new NumberNode(1),
  },
];
