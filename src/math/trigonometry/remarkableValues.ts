import { OppositeNode } from '#root/tree/nodes/functions/oppositeNode';
import { SqrtNode } from '#root/tree/nodes/functions/sqrtNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { PiNode } from '#root/tree/nodes/numbers/piNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { RemarkableValue } from './remarkableValue';

export const remarkableTrigoValues: RemarkableValue[] = [
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
    angle: new FractionNode(PiNode, new NumberNode(2)),
    cos: new NumberNode(0),
    sin: new NumberNode(1),
  },
  {
    angle: new FractionNode(new MultiplyNode(new NumberNode(2), PiNode), new NumberNode(3)),
    cos: new OppositeNode(new FractionNode(new NumberNode(1), new NumberNode(2))),
    sin: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
  },
  {
    angle: new FractionNode(new MultiplyNode(new NumberNode(3), PiNode), new NumberNode(4)),
    cos: new OppositeNode(new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2))),
    sin: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
  },
  {
    angle: PiNode,
    cos: new NumberNode(-1),
    sin: new NumberNode(0),
  },
];
