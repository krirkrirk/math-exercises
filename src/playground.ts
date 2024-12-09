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
import { square } from "./tree/nodes/operators/powerNode";
import { Rational } from "./math/numbers/rationals/rational";
import { parseLatex } from "./tree/parsers/latexParser";

export const playground = () => {
  // logIdentifiers();
  // const parsed = parseLatex("^{^3}");
  // console.log(parsed.toTex());
};

const logIdentifiers = () => {
  const ids =
    '{"xA":-3,"yA":-2,"yPrimeA":{"id":31,"child":{"id":3,"leftChild":{"id":7,"value":3},"rightChild":{"id":7,"value":2}}},"trinomCoeffs":[0.3888888888888889,0.833333333333333,-3]}';
  const parsed = <Record<string, any>>JSON.parse(ids);
  console.log(parsed);
  console.log(NodeConstructor.fromIdentifiers({ ...parsed.yPrimeA }).toTex());
};
