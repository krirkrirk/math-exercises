import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { opposite } from "#root/tree/nodes/functions/oppositeNode";
import { sqrt } from "#root/tree/nodes/functions/sqrtNode";
import {
  NodeConstructor,
  NodeIdentifiers,
} from "#root/tree/nodes/nodeConstructor";
import { isNumberNode } from "#root/tree/nodes/numbers/numberNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { square } from "#root/tree/nodes/operators/powerNode";
import { rationalParser } from "#root/tree/parsers/rationalParser";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  a: number;
  k: NodeIdentifiers;
  isSquareInside: boolean;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, isSquareInside, k },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const kNode = NodeConstructor.fromIdentifiers(k) as AlgebraicNode;
  if (kNode.evaluate() < 0) {
    tryToAddWrongProp(
      propositions,
      opposite(getAnswerNode({ a, k, isSquareInside })).toTex(),
    );
  }
  if (isSquareInside) {
  } else {
    tryToAddWrongProp(
      propositions,
      multiply(a ** 2, sqrt(kNode))
        .simplify()
        .toTex(),
    );
    tryToAddWrongProp(propositions, multiply(a, kNode).simplify().toTex());
  }
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      isNumberNode(kNode)
        ? randint(2, 100).frenchify()
        : RationalConstructor.randomIrreductible().toTree().toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswerNode = (identifiers: Identifiers) => {
  const { a, k, isSquareInside } = identifiers;
  const kNode = NodeConstructor.fromIdentifiers(k) as AlgebraicNode;

  const ansNode = (
    isSquareInside
      ? multiply(a, sqrt(square(kNode)))
      : square(multiply(a, sqrt(kNode)))
  ).simplify();
  return ansNode;
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return `${getAnswerNode(identifiers).toTex()}`;
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const { a, k, isSquareInside } = identifiers;
  const kNode = NodeConstructor.fromIdentifiers(k) as AlgebraicNode;
  return `Simplifier au maximum : 
  
$$
${(isSquareInside
  ? multiply(a, sqrt(square(kNode)))
  : square(multiply(a, sqrt(kNode)))
).toTex()}
$$`;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, a, isSquareInside, k },
) => {
  const answerNode = getAnswerNode({ a, isSquareInside, k });

  const parsed = rationalParser(ans);
  if (!parsed) return false;
  const simpTex = parsed.simplify().toTex();
  return (
    simpTex === answerNode.toTex() ||
    simpTex === answerNode.evaluate().frenchify()
  );
};

//a √(k^2) ou (a√k)^2
//avec k=b ou b/c
const getSquareRootsToSquareQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(2, 10);
  const isSquareInside = coinFlip();
  const isInt = coinFlip();
  const k = isInt
    ? randint(isSquareInside ? -10 : 2, 11, [0, 1]).toTree()
    : isSquareInside
    ? RationalConstructor.randomIrreductibleWithSign().toTree()
    : RationalConstructor.randomIrreductible().toTree();
  const identifiers: Identifiers = {
    a,
    k: k.toIdentifiers(),
    isSquareInside,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    // hint: getHint(identifiers),
    // correction: getCorrection(identifiers),
  };

  return question;
};

export const squareRootsToSquare: Exercise<Identifiers> = {
  id: "squareRootsToSquare",
  connector: "=",
  label: "Passer une racine carrée au carré",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getSquareRootsToSquareQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getAnswer,
  getInstruction,
};
