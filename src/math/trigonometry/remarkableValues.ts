import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

export interface RemarkableValue {
  angle: AlgebraicNode;
  cos: AlgebraicNode;
  degree: number;
  sin: AlgebraicNode;
  tan: AlgebraicNode;
  point: string;
}

export const remarkableTrigoValues: RemarkableValue[] = [
  {
    angle: new NumberNode(0),
    degree: 0,
    cos: new NumberNode(1),
    sin: new NumberNode(0),
    tan: new NumberNode(0),
    point: "I",
  },
  {
    angle: new FractionNode(PiNode, new NumberNode(6)),
    degree: 30,
    cos: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    sin: new FractionNode(new NumberNode(1), new NumberNode(2)),
    tan: new FractionNode(new NumberNode(1), new SqrtNode(new NumberNode(3))),
    point: "A",
  },
  {
    angle: new FractionNode(PiNode, new NumberNode(4)),
    degree: 45,
    cos: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    sin: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    tan: new NumberNode(1),
    point: "B",
  },
  {
    angle: new FractionNode(PiNode, new NumberNode(3)),
    degree: 60,
    cos: new FractionNode(new NumberNode(1), new NumberNode(2)),
    sin: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    tan: new SqrtNode(new NumberNode(3)),
    point: "C",
  },
  {
    angle: new FractionNode(PiNode, new NumberNode(2)),
    degree: 90,
    cos: new NumberNode(0),
    sin: new NumberNode(1),
    tan: new NumberNode(Infinity),
    point: "J",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(2), PiNode),
      new NumberNode(3),
    ),
    degree: 120,
    cos: new OppositeNode(
      new FractionNode(new NumberNode(1), new NumberNode(2)),
    ),
    sin: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    tan: new OppositeNode(new SqrtNode(new NumberNode(3))),
    point: "D",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(3), PiNode),
      new NumberNode(4),
    ),
    degree: 135,
    cos: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    ),
    sin: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    tan: new OppositeNode(new NumberNode(1)),
    point: "E",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(5), PiNode),
      new NumberNode(6),
    ),
    degree: 150,
    cos: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    ),
    sin: new FractionNode(new NumberNode(1), new NumberNode(2)),
    tan: new OppositeNode(
      new FractionNode(new NumberNode(1), new SqrtNode(new NumberNode(3))),
    ),
    point: "F",
  },
  {
    angle: PiNode,
    degree: 180,
    cos: new NumberNode(-1),
    sin: new NumberNode(0),
    tan: new NumberNode(0),
    point: "G",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(7), PiNode),
      new NumberNode(6),
    ),
    degree: 210,
    cos: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    ),
    sin: new OppositeNode(
      new FractionNode(new NumberNode(1), new NumberNode(2)),
    ),
    tan: new FractionNode(new NumberNode(1), new SqrtNode(new NumberNode(3))),
    point: "H",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(5), PiNode),
      new NumberNode(4),
    ),
    degree: 225,
    cos: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    ),
    sin: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    ),
    tan: new NumberNode(1),
    point: "K",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(4), PiNode),
      new NumberNode(3),
    ),
    degree: 240,
    cos: new OppositeNode(
      new FractionNode(new NumberNode(1), new NumberNode(2)),
    ),
    sin: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    ),
    tan: new SqrtNode(new NumberNode(3)),
    point: "L",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(3), PiNode),
      new NumberNode(2),
    ),
    degree: 270,
    cos: new NumberNode(0),
    sin: new NumberNode(-1),
    tan: new NumberNode(Infinity),
    point: "M",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(5), PiNode),
      new NumberNode(3),
    ),
    degree: 300,
    cos: new FractionNode(new NumberNode(1), new NumberNode(2)),
    sin: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    ),
    tan: new OppositeNode(new SqrtNode(new NumberNode(3))),
    point: "N",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(7), PiNode),
      new NumberNode(4),
    ),
    degree: 315,
    cos: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    sin: new OppositeNode(
      new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    ),
    tan: new OppositeNode(new NumberNode(1)),
    point: "P",
  },
  {
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(11), PiNode),
      new NumberNode(6),
    ),
    degree: 330,
    cos: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    sin: new OppositeNode(
      new FractionNode(new NumberNode(1), new NumberNode(2)),
    ),
    tan: new OppositeNode(
      new FractionNode(new NumberNode(1), new SqrtNode(new NumberNode(3))),
    ),
    point: "Q",
  },
];
