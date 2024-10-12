import { numberToFrenchWriting } from "./exercises/math/calcul/writing/numberToFrenchWriting";
import { Affine, AffineConstructor } from "./math/polynomials/affine";
import { Interval } from "./math/sets/intervals/intervals";
import {
  mainTrigoValues,
  negativeMainTrigovalues,
} from "./math/trigonometry/remarkableValues";
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
import { coinFlip } from "./utils/alea/coinFlip";
import { toSeperatedThousands } from "./utils/numberPrototype/toSeparatedThousands";
import { random } from "./utils/alea/random";
import { shuffle } from "./utils/alea/shuffle";
import { numberToFrenchWord } from "./utils/strings/numberToFrenchWord";

export const playground = () => {
  // console.log(mainTrigoValues.map((e) => e.angle.toTex()));
};
