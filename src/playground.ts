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
import { SubstractNode } from "./tree/nodes/operators/substractNode";
import { ClosureType } from "./tree/nodes/sets/closure";
import { DiscreteSetNode } from "./tree/nodes/sets/discreteSetNode";
import { coinFlip } from "./utils/coinFlip";
import { toSeperatedThousands } from "./utils/numberPrototype/toSeparatedThousands";
import { random } from "./utils/random";
import { shuffle } from "./utils/shuffle";

export const playground = () => {
  // const affine1 = new Affine(4, 5);
  // const affine2 = new Affine(2, 3);
  // const tree = affine1.toTree({ toTexOptions: { color: "green" } });
  // console.log(tree.opts);
  // console.log(tree.toTex());
  // const node = new MultiplyNode(
  //   affine1.toTree({ toTexOptions: { color: "green" } }),
  //   new (coinFlip() ? SubstractNode : AddNode)(affine2.toTree(), (1).toTree()),
  // ).toTex();
  // console.log(node);
  console.log((3).toTree({ toTexOptions: { color: "red" } }));
};
