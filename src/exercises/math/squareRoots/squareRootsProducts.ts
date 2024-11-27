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
import { SquareRootConstructor } from "#root/math/numbers/reals/real";
import { randint } from "#root/math/utils/random/randint";
import { sqrt } from "#root/tree/nodes/functions/sqrtNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
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
    const int = randint(-30, 30, [0]);
    const sqrt = SquareRootConstructor.randomIrreductible().toTree();
    tryToAddWrongProp(propositions, multiply(int, sqrt).toTex());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const { a, b, c, d } = identifiers;
  return multiply(multiply(a, sqrt(b)), multiply(c, sqrt(d)))
    .simplify()
    .toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const { a, b, c, d } = identifiers;
  return `Ecrire sous la forme $a\\sqrt{b}$, avec $b$ le plus petit possible : 

$$
${multiply(multiply(a, sqrt(b)), multiply(c, sqrt(d)), {
  forceTimesSign: true,
}).toTex()}
$$
  `;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

// a
const getSquareRootsProductsQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(-10, 10, [0]);
  const b = randint(2, 10);
  const c = randint(-10, 10, [0]);
  const d = coinFlip()
    ? randint(2, 10)
    : SquareRootConstructor.randomSimplifiable({
        allowPerfectSquare: false,
        maxSquare: 5,
      }).operand;
  const identifiers: Identifiers = { a, b, c, d };
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

export const squareRootsProducts: Exercise<Identifiers> = {
  id: "squareRootsProducts",
  connector: "=",
  label: "Produits de racines carrées",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getSquareRootsProductsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getAnswer,
};
