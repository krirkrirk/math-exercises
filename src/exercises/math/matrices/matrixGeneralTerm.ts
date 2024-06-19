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
import { Matrix, MatrixConstructor } from "#root/math/matrices/matrix";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { doWhile } from "#root/utils/doWhile";

type Identifiers = {
  n: number;
  p: number;
  alpha: number;
  beta: number;
};
//A d'ordre nxp avec a_(i,j) = alpha*i + beta*j
const getMatrixGeneralTermQuestion: QuestionGenerator<Identifiers> = () => {
  const n = randint(1, 5);
  const p = doWhile(
    () => randint(1, 5),
    (res) => n === 1 && res === 1,
  );
  const alpha = randint(-5, 6, [0]);
  const beta = randint(-5, 6, [0]);
  const aij = new AddNode(
    new MultiplyNode(alpha.toTree(), new VariableNode("i")),
    new MultiplyNode(beta.toTree(), new VariableNode("j")),
  ).simplify();
  const elements = Array.from(Array(n), (_, rowIndex) =>
    Array.from(Array(p), (__, colIndex) =>
      (alpha * (rowIndex + 1) + beta * (colIndex + 1)).toTree(),
    ),
  );
  const matrix = new Matrix(elements);
  const answer = matrix.toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $A = (a_{i,j})$ une matrice d'ordre $n \\times p$ telle que : $n = ${n}$, $p = ${p}$ et pour tout $1\\leq i \\leq n$ et $1\\leq j \\leq p$, $a_{i,j} = ${aij.toTex()}$. Quelle est l'expression de la matrice $A$ ? `,
    keys: [],
    answerFormat: "tex",
    identifiers: { n, p, alpha, beta },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  nb,
  { answer, n, p, alpha, beta },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const transposedElements = Array.from(Array(p), (_, rowIndex) =>
    Array.from(Array(n), (__, colIndex) =>
      (alpha * (rowIndex + 1) + beta * (colIndex + 1)).toTree(),
    ),
  );
  const matrix = new Matrix(transposedElements);
  tryToAddWrongProp(propositions, matrix.toTex());
  while (propositions.length < nb) {
    tryToAddWrongProp(propositions, MatrixConstructor.random(n, p).toTex());
  }
  return shuffleProps(propositions, nb);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const matrixGeneralTerm: Exercise<Identifiers> = {
  id: "matrixGeneralTerm",
  label: "Déterminer l'expression d'une matrice",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Matrices"],
  generator: (nb: number) =>
    getDistinctQuestions(getMatrixGeneralTermQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCU",
  subject: "Mathématiques",
};
