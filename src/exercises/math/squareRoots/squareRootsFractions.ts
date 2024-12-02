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
import { sqrt } from "#root/tree/nodes/functions/sqrtNode";
import { frac } from "#root/tree/nodes/operators/fractionNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { rationalParser } from "#root/tree/parsers/rationalParser";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  a: number;
  b: number;
  c: number;
  d: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      RationalConstructor.randomIrreductible().toTree().toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const { a, b, c, d } = identifiers;

  return frac(multiply(a, sqrt(b)), multiply(c, sqrt(d)))
    .simplify()
    .toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const { a, b, c, d } = identifiers;
  return `Simplifier au maximum : 
  
$$
${frac(multiply(a, sqrt(b)), multiply(c, sqrt(d))).toTex()}
$$`;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const parsed = rationalParser(ans);
  if (!parsed) return false;
  return parsed.simplify().toTex() === answer;
};

// a/√b + c/√d
// avec b/d = q^2 ou b/d = 1/q^2
const getSquareRootsFractionsQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(-10, 10, [0]);
  const c = randint(-10, 10, [0]);
  const q = randint(2, 10);
  let b: number;
  let d: number;
  if (coinFlip()) {
    d = randint(2, 10);
    b = d * q ** 2;
  } else {
    b = randint(2, 10);
    d = b * q ** 2;
  }

  const identifiers: Identifiers = {
    a,
    b,
    c,
    d,
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

export const squareRootsFractions: Exercise<Identifiers> = {
  id: "squareRootsFractions",
  connector: "=",
  label: "Fractions de racines carrées",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getSquareRootsFractionsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getAnswer,
};
