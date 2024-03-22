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
  SquareRoot,
  SquareRootConstructor,
} from "#root/math/numbers/reals/real";
import { randint } from "#root/math/utils/random/randint";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  a: number;
  b: number;
  c: number;
  d: number;
};

/**
 * a sqrt(b) (c + d sqrt(b))
 */
const getSquareRootsDistributivityQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = randint(1, 7);
  const aNode = new NumberNode(a);
  const c = randint(1, 7);
  const cNode = new NumberNode(c);
  const d = randint(-6, 7, [0]);
  const dNode = new NumberNode(d);
  const b = SquareRootConstructor.randomIrreductible(10);
  const bTree = b.toTree();
  const statement = new MultiplyNode(
    new MultiplyNode(aNode, bTree),
    new AddNode(cNode, new MultiplyNode(dNode, bTree)),
  );
  const answer = new AddNode(
    new MultiplyNode(new MultiplyNode(aNode, cNode), bTree),
    new MultiplyNode(new MultiplyNode(aNode, dNode), new NumberNode(b.operand)),
  )
    .simplify({ forbidFactorize: true })
    .toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Développer et simplifier : $${statement.toTex()}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { a, b: b.operand, c, d },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const sqrt = new SqrtNode(new NumberNode(b));
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new AddNode(
        new MultiplyNode(new NumberNode(randint(1, 10)), sqrt),
        new NumberNode(randint(-100, 100, [0])),
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c, d }) => {
  const aNode = new NumberNode(a);
  const cNode = new NumberNode(c);
  const dNode = new NumberNode(d);
  const bTree = new SqrtNode(new NumberNode(b));
  const answer = new AddNode(
    new MultiplyNode(new MultiplyNode(aNode, cNode), bTree),
    new MultiplyNode(new MultiplyNode(aNode, dNode), new NumberNode(b)),
  ).simplify({ forbidFactorize: true });
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};
export const squareRootsDistributivity: Exercise<Identifiers> = {
  id: "squareRootsDistributivity",
  connector: "=",
  label: "Distributivité avec des racines carrées",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Racines carrées", "Calcul littéral"],
  generator: (nb: number) =>
    getDistinctQuestions(getSquareRootsDistributivityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
