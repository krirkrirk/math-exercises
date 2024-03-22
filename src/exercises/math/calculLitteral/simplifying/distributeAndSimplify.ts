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
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  firstTermIsAffine: boolean;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
};

//[a]|[b*(cx+d)] +- e*(fx+g)]
// c & f > 0
const getDistributeAndSimplifyQuestion: QuestionGenerator<Identifiers> = () => {
  const firstTermIsAffine = coinFlip();
  const a = randint(-5, 6, [0]);
  const b = randint(-5, 6, [0]);
  const c = randint(1, 6);
  const d = randint(-5, 6, [0]);
  const e = randint(-5, 6, [0, 1]);
  let f = 0;
  do {
    f = randint(1, 6);
  } while (b * c + e * f === 0);
  const g = randint(-5, 6, [0]);
  const statement = new AddNode(
    firstTermIsAffine
      ? new MultiplyNode(b.toTree(), new Affine(c, d).toTree())
      : a.toTree(),
    new MultiplyNode(e.toTree(), new Affine(f, g).toTree()),
  ).simplify();

  const answer = firstTermIsAffine
    ? new Affine(b * c + e * f, b * d + e * g).toTree().toTex()
    : new Affine(e * f, a + e * g).toTree().toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Développer et réduire : $${statement.toTex()}$`,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { firstTermIsAffine, a, b, c, d, e, f, g },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      AffineConstructor.random().toTree().toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, firstTermIsAffine, a, b, c, d, e, f, g },
) => {
  const answerNode = firstTermIsAffine
    ? new Affine(b * c + e * f, b * d + e * g).toTree()
    : new Affine(e * f, a + e * g).toTree();
  const texs = answerNode.toAllValidTexs();
  return texs.includes(ans);
};
export const distributeAndSimplify: Exercise<Identifiers> = {
  id: "distributeAndSimplify",
  connector: "=",
  label: "Développer et réduire une expression",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: true,
  sections: ["Calcul littéral"],
  generator: (nb: number) =>
    getDistinctQuestions(getDistributeAndSimplifyQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
