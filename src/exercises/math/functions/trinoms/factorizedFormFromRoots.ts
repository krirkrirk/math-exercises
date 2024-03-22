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
import { randint } from "#root/math/utils/random/randint";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/coinFlip";
import { probaFlip } from "#root/utils/probaFlip";

type Identifiers = {
  roots: number[];
  a: number;
};

const getAnswer = (roots: number[], a: number) => {
  const isSingleRoot = roots.length === 1;
  return isSingleRoot
    ? new MultiplyNode(
        a.toTree(),
        new SquareNode(
          new SubstractNode(new VariableNode("x"), roots[0].toTree()),
        ),
      ).simplify({ keepPowers: true })
    : new MultiplyNode(
        new MultiplyNode(
          a.toTree(),
          new SubstractNode(new VariableNode("x"), roots[0].toTree()),
        ),
        new SubstractNode(new VariableNode("x"), roots[1].toTree()),
      ).simplify();
};
const getFactorizedFormFromRootsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = randint(-10, 10, [0]);
  const firstRoot = randint(-10, 10);
  const secondRoot = randint(-10, 10, [firstRoot]);
  const isSingleRoot = probaFlip(0.3);
  const roots = isSingleRoot
    ? [firstRoot]
    : [firstRoot, secondRoot].sort((a, b) => a - b);
  const answer = getAnswer(roots, a);
  const answerTex = answer.toTex();
  const question: Question<Identifiers> = {
    answer: answerTex,
    instruction: `Soit $f(x) = ax^2 + bx + c$ un polynôme du second degré avec $a = ${a}$ et qui a ${
      roots.length === 1
        ? `une racine : $${roots[0]}$`
        : `deux racines : $${roots[0]}$ et $${roots[1]}$`
    }. Déterminer la forme factorisée de $f$.`,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a, roots },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, roots },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    getAnswer(
      roots.map((r) => -r),
      a,
    ).toTex(),
  );
  while (propositions.length < n) {
    const x1 = randint(-10, 10);
    const x2 = randint(-10, 10, [x1]);
    tryToAddWrongProp(
      propositions,
      getAnswer(
        [x1, x2].sort((a, b) => a - b),
        randint(-10, 10, [0]),
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, a, roots }) => {
  const answerNode = getAnswer(roots, a);
  const texs = answerNode.toAllValidTexs();
  return texs.includes(ans);
};
export const factorizedFormFromRoots: Exercise<Identifiers> = {
  id: "factorizedFormFromRoots",
  connector: "=",
  label: "Déterminer la forme factorisée en connaissant les racines",
  levels: ["1rePro", "1reSpé"],
  isSingleStep: true,
  sections: ["Second degré"],
  generator: (nb: number) =>
    getDistinctQuestions(getFactorizedFormFromRootsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
