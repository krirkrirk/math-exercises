import {
  Exercise,
  GetAnswer,
  GetCorrection,
  GetHint,
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
import { Vector, VectorConstructor } from "#root/math/geometry/vector";
import { SquareRootConstructor } from "#root/math/numbers/reals/real";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { alignTex } from "#root/utils/latex/alignTex";

type Identifiers = {
  x: number;
  y: number;
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const u = new Vector("u", identifiers.x.toTree(), identifiers.y.toTree());
  const correctAnswer = u.getNorm();
  return correctAnswer.simplify().toTex();
};
const getHint: GetHint<Identifiers> = (identifiers) => {
  return `La norme d'un vecteur est la racine carrée de la somme des carrés de ses coordonnées. En d'autres termes, la norme du vecteur $$\\overrightarrow{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$$ est :
  
$$
\\lVert \\overrightarrow u \\rVert = \\sqrt{x^2+y^2}
$$
  `;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const x = identifiers.x.toTree();
  const y = identifiers.y.toTree();
  const answer = getAnswer(identifiers);
  return `La norme d'un vecteur est la racine carrée de la somme des carrés de ses coordonnées. Ici, on a donc : 

${alignTex([
  [
    "\\lVert \\overrightarrow u \\rVert",
    "=",
    new SqrtNode(new AddNode(new SquareNode(x), new SquareNode(y))).toTex(),
  ],
  [
    "",
    "=",
    new SqrtNode((x.evaluate({}) ** 2 + y.evaluate({}) ** 2).toTree()).toTex(),
  ],
])}

Donc $\\lVert \\overrightarrow u \\rVert = ${answer}$.
`;
};

const getVectorNormCalculationQuestion: QuestionGenerator<Identifiers> = () => {
  const u = VectorConstructor.random("u", false);
  const x = u.x.evaluate({});
  const y = u.y.evaluate({});
  const identifiers: Identifiers = { x, y };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: `Cacluler la norme du vecteur $${u.toTexWithCoords()}$`,
    keys: [],
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, x, y }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generateProposition(x, y).forEach((value) => {
    tryToAddWrongProp(propositions, value.simplify().toTex());
  });
  let sqrtRand;
  while (propositions.length < n) {
    sqrtRand = SquareRootConstructor.randomSimplifiable({});
    tryToAddWrongProp(propositions, sqrtRand.simplify().tex);
  }
  return shuffleProps(propositions, n);
};

const generateProposition = (x: number, y: number): AlgebraicNode[] => {
  let xNode = new NumberNode(x);
  let yNode = new NumberNode(y);

  const firstProposition = new AddNode(xNode, yNode);
  return [firstProposition];
};

const isAnswerValid: VEA<Identifiers> = (ans, { x, y }) => {
  const correctAnswer = new SqrtNode((x ** 2 + y ** 2).toTree());
  return correctAnswer
    .toAllValidTexs({ allowSimplifySqrt: true })
    .includes(ans);
};
export const vectorNormCalculation: Exercise<Identifiers> = {
  id: "vectorNormCalculation",
  label: "Calculer la norme d'un vecteur",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Vecteurs"],
  generator: (nb: number) =>
    getDistinctQuestions(getVectorNormCalculationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
  getHint,
  getCorrection,
};
