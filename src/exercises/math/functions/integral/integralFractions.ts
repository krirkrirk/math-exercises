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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { IntegralNode } from "#root/tree/nodes/functions/integralNode";
import { LogNode } from "#root/tree/nodes/functions/logNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
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

const getIntegralFractionsQuestion: QuestionGenerator<Identifiers> = () => {
  const questionType = coinFlip() ? "Trinomial" : "Affine";

  let trinomial: Trinom;
  let affine: Polynomial;
  let lowerBound: number;
  let upperBound: number;

  do {
    trinomial = TrinomConstructor.random(
      { min: -5, max: 5, excludes: [0] },
      { min: -5, max: 5 },
      { min: -5, max: 5 },
    );
    affine = trinomial.derivate();
    lowerBound = randint(-5, 5, [0]);
    upperBound = randint(-5, 5, [0]);

    while (lowerBound >= upperBound) {
      lowerBound = randint(-5, 5, [0]);
      upperBound = randint(-5, 5, [0]);
    }
  } while (doesTrinomialVanishInInterval(trinomial, lowerBound, upperBound));

  const fraction =
    questionType === "Trinomial"
      ? new FractionNode(affine.toTree(), trinomial.toTree())
      : new FractionNode(affine.coefficients[1].toTree(), affine.toTree());

  const integral = new IntegralNode(
    fraction,
    lowerBound.toTree(),
    upperBound.toTree(),
    "x",
  );

  const answer =
    questionType === "Trinomial"
      ? new SubstractNode(
          new LogNode(
            Math.abs(trinomial.calculate(upperBound)).toTree(),
          ).simplify(),
          new LogNode(
            Math.abs(trinomial.calculate(lowerBound)).toTree(),
          ).simplify(),
        ).simplify()
      : new SubstractNode(
          new LogNode(
            Math.abs(affine.calculate(upperBound)).toTree(),
          ).simplify(),
          new LogNode(
            Math.abs(affine.calculate(lowerBound)).toTree(),
          ).simplify(),
        ).simplify();

  const question: Question<Identifiers> = {
    answer: answer.toTex(),
    instruction: `Calculer : $${integral.toTex()}$`,
    keys: ["ln"],
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

  const wrongAnswer1 =
    questionType === "Trinomial"
      ? new SubstractNode(
          new LogNode(trinomial1.calculate(lowerBound).toTree()),
          new LogNode(trinomial1.calculate(upperBound).toTree()),
        ).simplify()
      : new SubstractNode(
          new LogNode(affine.calculate(lowerBound).toTree()),
          new LogNode(affine.calculate(upperBound).toTree()),
        ).simplify();

  const wrongAnswer2 =
    questionType === "Trinomial"
      ? new AddNode(
          new LogNode(trinomial1.calculate(upperBound).toTree()),
          new LogNode(trinomial1.calculate(lowerBound).toTree()),
        ).simplify()
      : new AddNode(
          new LogNode(affine.calculate(upperBound).toTree()),
          new LogNode(affine.calculate(lowerBound).toTree()),
        ).simplify();

  const wrongAnswer3 =
    questionType === "Trinomial"
      ? new SubstractNode(
          trinomial1.calculate(upperBound).toTree(),
          trinomial1.calculate(lowerBound).toTree(),
        ).simplify()
      : new SubstractNode(
          affine.calculate(upperBound).toTree(),
          affine.calculate(lowerBound).toTree(),
        ).simplify();

  tryToAddWrongProp(propositions, wrongAnswer1.toTex());
  tryToAddWrongProp(propositions, wrongAnswer2.toTex());
  tryToAddWrongProp(propositions, wrongAnswer3.toTex());

  while (propositions.length < n) {
    const random = randint(-10, 10, [0]);
    tryToAddWrongProp(propositions, new LogNode(random.toTree()).toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, questionType, upperBound, lowerBound, trinomial },
) => {
  const trinomial1 = new Trinom(trinomial[0], trinomial[1], trinomial[2]);
  const affine = trinomial1.derivate();

  const validanswer1 =
    questionType === "Trinomial"
      ? new SubstractNode(
          new LogNode(
            Math.abs(trinomial1.calculate(upperBound)).toTree(),
          ).simplify(),
          new LogNode(
            Math.abs(trinomial1.calculate(lowerBound)).toTree(),
          ).simplify(),
        ).simplify()
      : new SubstractNode(
          new LogNode(
            Math.abs(affine.calculate(upperBound)).toTree(),
          ).simplify(),
          new LogNode(
            Math.abs(affine.calculate(lowerBound)).toTree(),
          ).simplify(),
        ).simplify();

  const validanswer2 =
    questionType === "Trinomial"
      ? new LogNode(
          new FractionNode(
            Math.abs(trinomial1.calculate(upperBound)).toTree(),
            Math.abs(trinomial1.calculate(lowerBound)).toTree(),
          ).simplify(),
        )
      : new LogNode(
          new FractionNode(
            Math.abs(affine.calculate(upperBound)).toTree(),
            Math.abs(affine.calculate(lowerBound)).toTree(),
          ).simplify(),
        );

  const latexs = validanswer1
    .toAllValidTexs()
    .concat(validanswer2.toAllValidTexs());

  return latexs.includes(ans);
};

export const integralFractions: Exercise<Identifiers> = {
  id: "integralFractions",
  label: "Calcul d'intégrales de fonctions du type $\\frac{u'}{u}$",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Intégration"],
  generator: (nb: number) =>
    getDistinctQuestions(getIntegralFractionsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
