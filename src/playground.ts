import { Affine, AffineConstructor } from "./math/polynomials/affine";
import { Interval } from "./math/sets/intervals/intervals";
import { distinctRandTupleInt } from "./math/utils/random/randTupleInt";
import { CosNode } from "./tree/nodes/functions/cosNode";
import { ExpNode } from "./tree/nodes/functions/expNode";
import { SqrtNode } from "./tree/nodes/functions/sqrtNode";
import { NodeConstructor } from "./tree/nodes/nodeConstructor";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "./tree/nodes/numbers/infiniteNode";
import { NumberNode } from "./tree/nodes/numbers/numberNode";
import { AddNode } from "./tree/nodes/operators/addNode";
import { MultiplyNode } from "./tree/nodes/operators/multiplyNode";
import { ClosureType } from "./tree/nodes/sets/closure";
import { DiscreteSetNode } from "./tree/nodes/sets/discreteSetNode";
import { toSeperatedThousands } from "./utils/numberPrototype/toSeparatedThousands";
import { random } from "./utils/random";
import { shuffle } from "./utils/shuffle";

export const playground = () => {
  // const node = new AddNode(
  //   new MultiplyNode(new Affine(1, 0).toTree(), new Affine(3, 1).toTree()),
  //   new MultiplyNode(
  //     new ExpNode(new SqrtNode((3).toTree())),
  //     new CosNode((3).toTree()),
  //   ),
  // );
  // const node = new NumberNode(3);
  // const node = new MultiplyNode((2).toTree(), (3).toTree());
  // const ids = node.toIdentifiers();
  // const parsed = NodeConstructor.fromIdentifiers(ids);
  // console.log(node);
  // console.log(parsed);
  console.log(new Interval((3).toTree(), (5).toTree(), ClosureType.FF));
  console.log(new DiscreteSetNode([(2).toTree()]));
};
