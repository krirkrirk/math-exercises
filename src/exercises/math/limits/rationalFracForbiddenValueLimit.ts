import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Integer } from "#root/math/numbers/integer/integer";
import { Rational } from "#root/math/numbers/rationals/rational";
import { Affine } from "#root/math/polynomials/affine";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { TrinomConstructor } from "#root/math/polynomials/trinom";
import { DiscreteSet } from "#root/math/sets/discreteSet";
import { Interval } from "#root/math/sets/intervals/intervals";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  numCoeffs: number[];
  denumCoeffs: number[];

  isRight: boolean;
};

const getSign = (nb: number) => {
  return nb >= 0 ? "+" : "-";
};

const getSequenceRationalFracLimitQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const polyDenum = new Affine(1, randint(-9, 10, [0]));

  const forbiddenValue = -polyDenum.b;

  const polyNum = TrinomConstructor.randomFactorized(
    undefined,
    { excludes: [forbiddenValue] },
    { excludes: [forbiddenValue] },
  );

  const numLimit = polyNum.calculate(-polyDenum.b);

  const isRight = coinFlip();
  const to = isRight ? `${forbiddenValue}` : `${forbiddenValue}`;
  const from = isRight ? `x>${forbiddenValue}` : `x<${forbiddenValue}`;
  const answer = isRight
    ? `${getSign(numLimit)}\\infty`
    : `${getSign(-numLimit)}\\infty`;

  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $f$ la fonction définie par : $f(x) = \\dfrac{${polyNum
      .toTree()
      .toTex()}}{${polyDenum
      .toTree()
      .toTex()}}$. Déterminer $\\lim\\limits_{x \\to ${to}, \\ ${from}}f(x).$
      `,
    keys: ["infty"],
    answerFormat: "tex",
    identifiers: {
      numCoeffs: polyNum.coefficients,
      denumCoeffs: polyDenum.coefficients,
      isRight,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, numCoeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, "+\\infty");
  tryToAddWrongProp(propositions, "-\\infty");
  tryToAddWrongProp(propositions, "0");
  tryToAddWrongProp(propositions, numCoeffs[numCoeffs.length - 1].toString());
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 10) + "");
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, numCoeffs, denumCoeffs, isRight },
) => {
  return ans === answer;
};

export const rationalFracForbiddenValueLimit: Exercise<Identifiers> = {
  id: "rationalFracForbiddenValueLimit",
  connector: "=",
  label: "Limite d'une fraction rationnelle avec valeur interdite",
  levels: ["TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Limites"],
  generator: (nb: number) =>
    getDistinctQuestions(getSequenceRationalFracLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
