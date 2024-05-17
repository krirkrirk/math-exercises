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
import { Trinom } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";

type Identifiers = {
  trinomial: number[];
  leftbound: number;
  rightbound: number;
};

const getAffineMeanValueQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(-10, 10, [0]);
  const b = randint(-10, 10);
  const trinomial = new Trinom(a, b, randint(-10, 10));

  const leftbound = randint(-10, 10);
  const rightbound = randint(leftbound + 1, leftbound + 11);

  const func = trinomial.derivate().toTree().toTex();
  const interval = new IntervalNode(
    leftbound.toTree(),
    rightbound.toTree(),
    ClosureType.FF,
  ).toTex();

  const answer = new MultiplyNode(
    new FractionNode(new NumberNode(1), (rightbound - leftbound).toTree()),
    (trinomial.calculate(rightbound) - trinomial.calculate(leftbound)).toTree(),
  )
    .simplify()
    .toTex();

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Soit $f(x) = ${func}$. Quel est la valeur moyenne de $f$ sur l'intervalle $${interval}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      trinomial: [trinomial.a, trinomial.b, trinomial.c],
      rightbound,
      leftbound,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, trinomial, leftbound, rightbound },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const trinomial1 = new Trinom(trinomial[0], trinomial[1], trinomial[2]);

  const wrongAnswer1 = new AddNode(
    new FractionNode(
      new NumberNode(1),
      (rightbound - leftbound).toTree(),
    ).simplify(),
    (
      trinomial1.calculate(rightbound) - trinomial1.calculate(leftbound)
    ).toTree(),
  ).toTex();

  const wrongAnswer2 = new MultiplyNode(
    new FractionNode(new NumberNode(1), (leftbound - rightbound).toTree()),
    (
      trinomial1.calculate(rightbound) - trinomial1.calculate(leftbound)
    ).toTree(),
  )
    .simplify()
    .toTex();

  const wrongAnswer3 = (
    trinomial1.calculate(rightbound) - trinomial1.calculate(leftbound)
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
  { answer, trinomial, leftbound, rightbound },
) => {
  const trinomial1 = new Trinom(trinomial[0], trinomial[1], trinomial[2]);
  const validanswer = new MultiplyNode(
    new FractionNode(new NumberNode(1), (rightbound - leftbound).toTree()),
    (
      trinomial1.calculate(rightbound) - trinomial1.calculate(leftbound)
    ).toTree(),
  ).simplify();

  const latexs = validanswer.toAllValidTexs();

  return latexs.includes(ans);
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
