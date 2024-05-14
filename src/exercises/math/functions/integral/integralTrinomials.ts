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
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { Trinom } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { IntegralNode } from "#root/tree/nodes/functions/IntegralNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  lowerBound: number;
  upperBound: number;
  quadrinomial: number[];
};

const getIntegralTrinomialsQuestion: QuestionGenerator<Identifiers> = () => {
  const quadCoeffs = [
    randint(-5, 5),
    randint(-5, 5),
    randint(-2, 3),
    randint(-5, 5, [0]),
  ];

  const quadrinomial = new Polynomial(quadCoeffs);
  const trinomial = quadrinomial.derivate() as Trinom;

  let lowerBound = randint(-3, 4);
  let upperBound = randint(-3, 4);

  while (lowerBound >= upperBound) {
    lowerBound = randint(-3, 4);
    upperBound = randint(-3, 4);
  }

  const integral = new IntegralNode(
    trinomial.toTree(),
    lowerBound.toTree(),
    upperBound.toTree(),
    "x",
  ).toTex();

  const answer = (
    quadrinomial.calculate(upperBound) - quadrinomial.calculate(lowerBound)
  )
    .toTree()
    .toTex();

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Calculez la valeur de l'intégrale suivante : $${integral}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      lowerBound,
      upperBound,
      quadrinomial: quadrinomial.coefficients,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, lowerBound, upperBound, quadrinomial },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const quadrinomial1 = new Polynomial(quadrinomial);
  const trinomial = quadrinomial1.derivate();

  const wrongAnswer1 = (
    quadrinomial1.calculate(lowerBound) - quadrinomial1.calculate(upperBound)
  )
    .toTree()
    .toTex();
  const wrongAnswer2 = (
    trinomial.calculate(upperBound) - trinomial.calculate(lowerBound)
  )
    .toTree()
    .toTex();
  const wrongAnswer3 = (
    trinomial.calculate(lowerBound) - trinomial.calculate(upperBound)
  )
    .toTree()
    .toTex();

  tryToAddWrongProp(propositions, wrongAnswer1);
  tryToAddWrongProp(propositions, wrongAnswer2);
  tryToAddWrongProp(propositions, wrongAnswer3);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 10).toTree().toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const integralTrinomials: Exercise<Identifiers> = {
  id: "integralTrinomials",
  label: "Calcul d'intégrales de fonctions trinômes",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Intégration"],
  generator: (nb: number) =>
    getDistinctQuestions(getIntegralTrinomialsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
