import { numberToFrenchWriting } from "./exercises/math/calcul/writing/numberToFrenchWriting";
import { Affine, AffineConstructor } from "./math/polynomials/affine";
import { Interval, IntervalConstructor } from "./math/sets/intervals/intervals";
import {
  mainTrigoValues,
  negativeMainTrigovalues,
} from "./math/trigonometry/remarkableValues";
import { distinctRandTupleInt } from "./math/utils/random/randTupleInt";
import { CosNode } from "./tree/nodes/functions/cosNode";
import { ExpNode } from "./tree/nodes/functions/expNode";
import { SqrtNode, sqrt } from "./tree/nodes/functions/sqrtNode";
import { NodeConstructor } from "./tree/nodes/nodeConstructor";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "./tree/nodes/numbers/infiniteNode";
import { NumberNode } from "./tree/nodes/numbers/numberNode";
import { AddNode } from "./tree/nodes/operators/addNode";
import { MultiplyNode, multiply } from "./tree/nodes/operators/multiplyNode";
import { SubstractNode } from "./tree/nodes/operators/substractNode";
import { ClosureType } from "./tree/nodes/sets/closure";
import { DiscreteSetNode } from "./tree/nodes/sets/discreteSetNode";
import { coinFlip } from "./utils/alea/coinFlip";
import { toSeperatedThousands } from "./utils/numberPrototype/toSeparatedThousands";
import { random } from "./utils/alea/random";
import { shuffle } from "./utils/alea/shuffle";
import { numberToFrenchWord } from "./utils/strings/numberToFrenchWord";
import { DecimalConstructor } from "./math/numbers/decimals/decimal";
import { randint } from "./math/utils/random/randint";
import { numberParser } from "./tree/parsers/numberParser";
import { FractionNode, frac } from "./tree/nodes/operators/fractionNode";
import { OppositeNode, opposite } from "./tree/nodes/functions/oppositeNode";
import { PointConstructor } from "./math/geometry/point";
import { randfloat } from "./math/utils/random/randfloat";
import { VectorConstructor } from "./math/geometry/vector";

export const playground = () => {};
