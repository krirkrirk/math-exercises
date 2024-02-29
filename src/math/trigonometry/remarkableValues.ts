import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { Integer } from "../numbers/integer/integer";
import { Rational } from "../numbers/rationals/rational";

export interface RemarkableValue {
  angle: AlgebraicNode;
  cos: AlgebraicNode;
  sin: AlgebraicNode;
  point: string;
}
export const remarkableTrigoValues: RemarkableValue[] = [
  {
    // angleValue: 0,
    angle: new NumberNode(0),
    cos: new NumberNode(1),
    sin: new NumberNode(0),
    point: "I",
  },
  {
    // angleValue: Math.PI / 6,
    angle: new FractionNode(PiNode, new NumberNode(6)),
    cos: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    sin: new FractionNode(new NumberNode(1), new NumberNode(2)),
    point: "A",
  },
  {
    // angleValue: Math.PI / 4,

    angle: new FractionNode(PiNode, new NumberNode(4)),
    cos: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    sin: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    point: "B",
  },
  {
    // angleValue: Math.PI / 3,

    angle: new FractionNode(PiNode, new NumberNode(3)),
    cos: new FractionNode(new NumberNode(1), new NumberNode(2)),
    sin: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    point: "C",
  },
  {
    // angleValue: Math.PI / 2,

    angle: new FractionNode(PiNode, new NumberNode(2)),
    cos: new NumberNode(0),
    sin: new NumberNode(1),
    point: "J",
  },
  {
    // angleValue: (Math.PI * 2) / 3,

    angle: new FractionNode(
      new MultiplyNode(new NumberNode(2), PiNode),
      new NumberNode(3),
    ),
    cos: new OppositeNode(
      new FractionNode(new NumberNode(1), new NumberNode(2)),
    ),
    sin: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    point: "D",
  },
  {
    // angleValue: (Math.PI * 3) / 4,

    angle: new FractionNode(
      new MultiplyNode(new NumberNode(3), PiNode),
      new NumberNode(4),
    ),
    cos: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    ),
    sin: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    point: "E",
  },
  {
    // angleValue: (Math.PI * 5) / 6,

    angle: new FractionNode(
      new MultiplyNode(new NumberNode(5), PiNode),
      new NumberNode(6),
    ),

    cos: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    ),
    sin: new FractionNode(new NumberNode(1), new NumberNode(2)),
    point: "F",
  },
  {
    // angleValue: Math.PI,
    //
    angle: PiNode,
    cos: new NumberNode(-1),
    sin: new NumberNode(0),
    point: "G",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(7), PiNode),
      new NumberNode(6),
    ),
    cos: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    ),
    sin: new OppositeNode(
      new FractionNode(new NumberNode(1), new NumberNode(2)),
    ),
    point: "H",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(5), PiNode),
      new NumberNode(4),
    ),
    cos: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    ),
    sin: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    ),
    point: "K",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(4), PiNode),
      new NumberNode(3),
    ),
    cos: new OppositeNode(
      new FractionNode(new NumberNode(1), new NumberNode(2)),
    ),
    sin: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    ),
    point: "L",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(3), PiNode),
      new NumberNode(2),
    ),
    cos: new NumberNode(0),
    sin: new NumberNode(-1),
    point: "M",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(5), PiNode),
      new NumberNode(3),
    ),
    cos: new FractionNode(new NumberNode(1), new NumberNode(2)),

    sin: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    ),
    point: "N",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(7), PiNode),
      new NumberNode(4),
    ),
    cos: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),

    sin: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    ),
    point: "P",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(11), PiNode),
      new NumberNode(6),
    ),
    cos: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),

    sin: new OppositeNode(
      new FractionNode(new NumberNode(1), new NumberNode(2)),
    ),
    point: "Q",
  },
];
