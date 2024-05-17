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
import { AffineConstructor } from "#root/math/polynomials/affine";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { IntegralNode } from "#root/tree/nodes/functions/integralNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  lowerBound: number;
  upperBound: number;
  trinomial: number[];
};

const getIntegralAffinesQuestion: QuestionGenerator<Identifiers> = () => {
  const trinomial = TrinomConstructor.random();
  const affine = trinomial.derivate();

  let lowerBound = randint(-5, 5);
  let upperBound = randint(-5, 5);

  while (lowerBound >= upperBound) {
    lowerBound = randint(-5, 5);
    upperBound = randint(-5, 5);
  }

  const integral = new IntegralNode(
    affine.toTree(),
    lowerBound.toTree(),
    upperBound.toTree(),
    "x",
  ).toTex();

  const answer = (
    trinomial.calculate(upperBound) - trinomial.calculate(lowerBound)
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
      trinomial: [trinomial.a, trinomial.b, trinomial.c],
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, lowerBound, upperBound, trinomial },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const trinomial1 = new Trinom(trinomial[0], trinomial[1], trinomial[2]);
  const affine = trinomial1.derivate();

  const wrongAnswer1 = (
    trinomial1.calculate(lowerBound) - trinomial1.calculate(upperBound)
  )
    .toTree()
    .toTex();
  const wrongAnswer2 = (
    affine.calculate(upperBound) - affine.calculate(lowerBound)
  )
    .toTree()
    .toTex();
  const wrongAnswer3 = (
    affine.calculate(lowerBound) - affine.calculate(upperBound)
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
export const integralAffines: Exercise<Identifiers> = {
  id: "integralAffines",
  label: "Calcul d'intégrales de fonctions affines",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Intégration"],
  generator: (nb: number) =>
    getDistinctQuestions(getIntegralAffinesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
