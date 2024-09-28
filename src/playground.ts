import { Affine, AffineConstructor } from "./math/polynomials/affine";
import { distinctRandTupleInt } from "./math/utils/random/randTupleInt";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "./tree/nodes/numbers/infiniteNode";
import { AddNode } from "./tree/nodes/operators/addNode";
import { MultiplyNode } from "./tree/nodes/operators/multiplyNode";
import { toSeperatedThousands } from "./utils/numberPrototype/toSeparatedThousands";
import { random } from "./utils/random";
import { shuffle } from "./utils/shuffle";

export const playground = () => {
  console.log(MinusInfinityNode.evaluate({}));
};
