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
import { IntegralNode } from "#root/tree/nodes/functions/IntegralNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";

type Identifiers = {
  lowerBound: number;
  upperBound: number;
  trinomial: number[];
};

const getAffineMeanValueQuestion: QuestionGenerator<Identifiers> = () => {
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

  const meanValue = new FractionNode(
    new AddNode(
      trinomial.calculate(upperBound).toTree(),
      trinomial.calculate(lowerBound).toTree(),
    ),
    new VariableNode("2"),
  )
    .simplify()
    .toTex();

  const question: Question<Identifiers> = {
    answer: meanValue,
    instruction: `Calculez la valeur moyenne de la fonction affine sur l'intervalle $[${lowerBound}; ${upperBound}]$. La fonction est représentée par l'intégrale suivante : $${integral}$.`,
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

  const wrongAnswer1 = new FractionNode(
    new AddNode(
      trinomial1.calculate(lowerBound).toTree(),
      trinomial1.calculate(upperBound).toTree(),
    ),
    new VariableNode("2"),
  )
    .simplify()
    .toTex();
  const wrongAnswer2 = new FractionNode(
    trinomial1.calculate(upperBound).toTree(),
    new VariableNode("2"),
  )
    .simplify()
    .toTex();
  const wrongAnswer3 = new FractionNode(
    trinomial1.calculate(lowerBound).toTree(),
    new VariableNode("2"),
  )
    .simplify()
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

export const affineMeanValue: Exercise<Identifiers> = {
  id: "affineMeanValue",
  label: "Calcul de la valeur moyenne d'une fonction affine",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Intégration"],
  generator: (nb: number) =>
    getDistinctQuestions(getAffineMeanValueQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
