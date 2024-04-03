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
  degree: number;
  sin: AlgebraicNode;
  point: string;
}
export const remarkableTrigoValues: RemarkableValue[] = [
  {
    // angleValue: 0,
    angle: new NumberNode(0),
    degree: 0,
    cos: new NumberNode(1),
    sin: new NumberNode(0),
    point: "I",
  },
  {
    // angleValue: Math.PI / 6,
    angle: new FractionNode(PiNode, new NumberNode(6)),
    degree: 30,
    cos: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    sin: new FractionNode(new NumberNode(1), new NumberNode(2)),
    point: "A",
  },
  {
    // angleValue: Math.PI / 4,
    degree: 45,
    angle: new FractionNode(PiNode, new NumberNode(4)),
    cos: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    sin: new FractionNode(new SqrtNode(new NumberNode(2)), new NumberNode(2)),
    point: "B",
  },
  {
    // angleValue: Math.PI / 3,
    degree: 60,
    angle: new FractionNode(PiNode, new NumberNode(3)),
    cos: new FractionNode(new NumberNode(1), new NumberNode(2)),
    sin: new FractionNode(new SqrtNode(new NumberNode(3)), new NumberNode(2)),
    point: "C",
  },
  {
    // angleValue: Math.PI / 2,
    degree: 90,
    angle: new FractionNode(PiNode, new NumberNode(2)),
    cos: new NumberNode(0),
    sin: new NumberNode(1),
    point: "J",
  },
  {
    // angleValue: (Math.PI * 2) / 3,
    degree: 120,
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
    degree: 135,
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
    degree: 150,
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
    degree: 180,
    angle: PiNode,
    cos: new NumberNode(-1),
    sin: new NumberNode(0),
    point: "G",
  },
  {
    //7PI/6
    degree: 210,
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
    degree: 225,
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
    //4PI/3
    degree: 240,
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
    //3PI/2
    degree: 270,
    angle: new FractionNode(
      new MultiplyNode(new NumberNode(3), PiNode),
      new NumberNode(2),
    ),
    cos: new NumberNode(0),
    sin: new NumberNode(-1),
    point: "M",
  },
  {
    //5PI/3,
    degree: 300,
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
    //7pi/4
    degree: 315,
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
    //11pi/6,
    degree: 330,
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
