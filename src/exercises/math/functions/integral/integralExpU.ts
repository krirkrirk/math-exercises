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
import { Affine } from "#root/math/polynomials/affine";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { IntegralNode } from "#root/tree/nodes/functions/IntegralNode";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  questionType: string;
  trinomial: number[];
  upperBound: number;
  lowerBound: number;
};

const doesTrinomialVanishInInterval = (
  trinomial: Trinom,
  a: number,
  b: number,
): boolean => {
  const calculate = (x: number) => trinomial.calculate(x);
  for (let x = a; x <= b; x++) {
    if (calculate(x) === 0) {
      return true;
    }
  }
  return false;
};

const getIntegralExpUQuestion: QuestionGenerator<Identifiers> = () => {
  const questionType = coinFlip() ? "Trinomial" : "Affine";

  let trinomial: Trinom;
  let affine: Polynomial;
  let lowerBound: number;
  let upperBound: number;

  do {
    trinomial = TrinomConstructor.random(
      { min: -5, max: 5, excludes: [0] },
      { min: -5, max: 5, excludes: [0] },
      { min: -5, max: 5, excludes: [0] },
    );
    affine = trinomial.derivate();
    lowerBound = randint(-5, 5, [0]);
    upperBound = randint(-5, 5, [0]);

    while (lowerBound >= upperBound) {
      lowerBound = randint(-5, 5, [0]);
      upperBound = randint(-5, 5, [0]);
    }
  } while (doesTrinomialVanishInInterval(trinomial, lowerBound, upperBound));

  const polynomial = questionType === "Trinomial" ? trinomial : affine;

  const expU = new MultiplyNode(
    polynomial.derivate().toTree(),
    new ExpNode(polynomial.toTree()),
  );

  const integral = new IntegralNode(
    expU,
    lowerBound.toTree(),
    upperBound.toTree(),
    "x",
  );

  const answer = new SubstractNode(
    new ExpNode(polynomial.calculate(upperBound).toTree()).simplify(),
    new ExpNode(polynomial.calculate(lowerBound).toTree()).simplify(),
  ).simplify();

  const question: Question<Identifiers> = {
    answer: answer.toTex(),
    instruction: `Calculez la valeur de l'intégrale suivante : $${integral.toTex()}$`,
    keys: ["e"],
    answerFormat: "tex",
    identifiers: {
      questionType,
      trinomial: [trinomial.a, trinomial.b, trinomial.c],
      upperBound,
      lowerBound,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, questionType, trinomial, upperBound, lowerBound },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const trinomial1 = new Trinom(trinomial[0], trinomial[1], trinomial[2]);
  const affine = trinomial1.derivate();

  const polynomial = questionType === "Trinomial" ? trinomial1 : affine;

  const wrongAnswer1 = new SubstractNode(
    new ExpNode(polynomial.calculate(lowerBound).toTree()).simplify(),
    new ExpNode(polynomial.calculate(upperBound).toTree()).simplify(),
  ).simplify();

  const wrongAnswer2 = new AddNode(
    new ExpNode(polynomial.calculate(upperBound).toTree()).simplify(),
    new ExpNode(polynomial.calculate(lowerBound).toTree()).simplify(),
  ).simplify();

  const wrongAnswer3 = new SubstractNode(
    polynomial.calculate(upperBound).toTree().simplify(),
    polynomial.calculate(lowerBound).toTree().simplify(),
  ).simplify();

  tryToAddWrongProp(propositions, wrongAnswer1.toTex());
  tryToAddWrongProp(propositions, wrongAnswer2.toTex());
  tryToAddWrongProp(propositions, wrongAnswer3.toTex());

  while (propositions.length < n) {
    const random = randint(-10, 10, [0]);
    tryToAddWrongProp(propositions, new ExpNode(random.toTree()).toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, questionType, upperBound, lowerBound, trinomial },
) => {
  const trinomial1 = new Trinom(trinomial[0], trinomial[1], trinomial[2]);
  const affine = trinomial1.derivate();

  const polynomial = questionType === "Trinomial" ? trinomial1 : affine;

  const validAnswer = new SubstractNode(
    new ExpNode(polynomial.calculate(upperBound).toTree()).simplify(),
    new ExpNode(polynomial.calculate(lowerBound).toTree()).simplify(),
  ).simplify();

  const latexs = validAnswer.toAllValidTexs({ allowPowerOne: true });

  return latexs.includes(ans);
};

export const integralExpU: Exercise<Identifiers> = {
  id: "integralExpU",
  label: "Calcul d'intégrales de fonctions u'e^u",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Intégration"],
  generator: (nb: number) => getDistinctQuestions(getIntegralExpUQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
