import { numberToFrenchWriting } from "./exercises/math/calcul/writing/numberToFrenchWriting";
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
import { numberToFrenchWord } from "./utils/strings/numberToFrenchWord";

export const playground = () => {
  // for (let i = 0; i < 10000; i++) {
  //   console.log(numberToFrenchWord(i));
  // }
  console.log(numberToFrenchWord(2));
  console.log(numberToFrenchWord(21));
  console.log(numberToFrenchWord(71));
  console.log(numberToFrenchWord(100));
  console.log(numberToFrenchWord(120));
  console.log(numberToFrenchWord(281));
  console.log(numberToFrenchWord(323));
  console.log(numberToFrenchWord(900));
  console.log(numberToFrenchWord(999));
  console.log(numberToFrenchWord(1000));
  console.log(numberToFrenchWord(1100));
  console.log(numberToFrenchWord(1323));
  console.log(numberToFrenchWord(3000));
  console.log(numberToFrenchWord(3242));
  console.log(numberToFrenchWord(9999));
  console.log(numberToFrenchWord(10000));
  console.log(numberToFrenchWord(11000));
  console.log(numberToFrenchWord(10001));
  console.log(numberToFrenchWord(10100));
  console.log(numberToFrenchWord(10010));

  console.log(numberToFrenchWord(12345));

  console.log(numberToFrenchWord(12234));
  console.log(numberToFrenchWord(100000));
  console.log(numberToFrenchWord(1001000));
  console.log(numberToFrenchWord(1000100));

  console.log(numberToFrenchWord(1000000));

  console.log(numberToFrenchWord(9999999));
};
