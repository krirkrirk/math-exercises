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
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";

type Identifiers = {
  quadrinomial: number[];
  leftbound: number;
  rightbound: number;
};

const getTrinomialMeanValueQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(-5, 7, [0]);
  const b = randint(-5, 7);
  const quadrinomial = new Polynomial([randint(-5, 7), randint(-5, 7), b, a]);

  const leftbound = randint(-5, 6);
  const rightbound = randint(leftbound + 1, leftbound + 1);

  const func = quadrinomial.derivate().toTree().toTex();
  const interval = new IntervalNode(
    leftbound.toTree(),
    rightbound.toTree(),
    ClosureType.FF,
  ).toTex();

  const answer = new MultiplyNode(
    new FractionNode(new NumberNode(1), (rightbound - leftbound).toTree()),
    (
      quadrinomial.calculate(rightbound) - quadrinomial.calculate(leftbound)
    ).toTree(),
  )
    .simplify()
    .toTex();

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Soit $f(x) = ${func}$. Quelle est la valeur moyenne de $f$ sur $${interval}$ ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      quadrinomial: quadrinomial.coefficients,
      rightbound,
      leftbound,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, quadrinomial, leftbound, rightbound },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const quadrinomial1 = new Polynomial(quadrinomial);

  const wrongAnswer1 = new AddNode(
    new FractionNode(
      new NumberNode(1),
      (rightbound - leftbound).toTree(),
    ).simplify(),
    (
      quadrinomial1.calculate(rightbound) - quadrinomial1.calculate(leftbound)
    ).toTree(),
  )
    .simplify({ forbidFactorize: true })
    .toTex();

  const wrongAnswer2 = new MultiplyNode(
    new FractionNode(new NumberNode(1), (leftbound - rightbound).toTree()),
    (
      quadrinomial1.calculate(rightbound) - quadrinomial1.calculate(leftbound)
    ).toTree(),
  )
    .simplify()
    .toTex();

  const wrongAnswer3 = (
    quadrinomial1.calculate(rightbound) - quadrinomial1.calculate(leftbound)
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

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, quadrinomial, leftbound, rightbound },
) => {
  const quadrinomial1 = new Polynomial(quadrinomial);
  const validanswer = new MultiplyNode(
    new FractionNode(new NumberNode(1), (rightbound - leftbound).toTree()),
    (
      quadrinomial1.calculate(rightbound) - quadrinomial1.calculate(leftbound)
    ).toTree(),
  ).simplify();

  const latexs = validanswer.toAllValidTexs();

  return latexs.includes(ans);
};
export const trinomialMeanValue: Exercise<Identifiers> = {
  id: "trinomialMeanValue",
  label: "Calcul de la valeur moyenne d'une fonction trinôme",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Intégration"],
  generator: (nb: number) =>
    getDistinctQuestions(getTrinomialMeanValueQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
