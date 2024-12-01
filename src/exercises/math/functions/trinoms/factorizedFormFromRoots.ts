import {
  Exercise,
  GetInstruction,
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
import {
  MultiplyNode,
  multiply,
} from "#root/tree/nodes/operators/multiplyNode";
import { SquareNode, square } from "#root/tree/nodes/operators/powerNode";
import {
  SubstractNode,
  substract,
} from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { probaFlip } from "#root/utils/alea/probaFlip";

type Identifiers = {
  roots: number[];
  a: number;
};

const getAnswerNode = (roots: number[], a: number) => {
  const isSingleRoot = roots.length === 1;
  return isSingleRoot
    ? multiply(a, square(substract("x", roots[0]))).simplify({
        keepPowers: true,
      })
    : multiply(
        multiply(a, substract("x", roots[0])),
        substract("x", roots[1]),
      ).simplify();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const { a, roots } = identifiers;
  return `Soit $f(x) = ax^2 + bx + c$ un polynôme du second degré avec $a = ${a}$ et qui a ${
    roots.length === 1
      ? `pour seule racine : $${roots[0]}$`
      : `deux racines : $${roots[0]}$ et $${roots[1]}$`
  }. Déterminer la forme factorisée de $f$.`;
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
  const answer = getAnswerNode(roots, a);
  const answerTex = answer.toTex();
  const identifiers = { a, roots };
  const question: Question<Identifiers> = {
    answer: answerTex,
    instruction: getInstruction(identifiers),
    keys: ["x"],
    answerFormat: "tex",
    identifiers,
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
    getAnswerNode(
      roots.map((r) => -r),
      a,
    ).toTex(),
  );
  while (propositions.length < n) {
    const x1 = randint(-10, 10);
    const x2 = randint(-10, 10, [x1]);
    tryToAddWrongProp(
      propositions,
      getAnswerNode(
        [x1, x2].sort((a, b) => a - b),
        randint(-10, 10, [0]),
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, a, roots }) => {
  const answerNode = getAnswerNode(roots, a);
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
