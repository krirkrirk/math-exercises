import {
  Exercise,
  GetAnswer,
  GetCorrection,
  GetHint,
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
import {
  SpaceVector,
  SpaceVectorConstructor,
} from "#root/math/geometry/spaceVector";
import { VectorConstructor } from "#root/math/geometry/vector";
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
  z: number;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return "La norme d'un vecteur de l'espace est la racine carrée de la somme des carrés de ses coordonnées.";
};

const getCorrection: GetCorrection<Identifiers> = ({ x, y, z }) => {
  const answer = getAnswer({ x, y, z });
  return `La norme d'un vecteur de l'espace est la racine carrée de la somme des carrés de ses coordonnées. Ici, on a donc : 
 
${alignTex([
  [
    "\\lVert \\overrightarrow u \\rVert",
    "=",
    new SqrtNode(
      new AddNode(
        new SquareNode(x.toTree()),
        new AddNode(new SquareNode(y.toTree()), new SquareNode(z.toTree())),
      ),
    ).toTex(),
  ],
  ["", "=", new SqrtNode((x ** 2 + y ** 2 + z ** 2).toTree()).toTex()],
])}

Donc $\\lVert \\overrightarrow u \\rVert = ${answer}$.
`;
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const u = new SpaceVector(
    "u",
    identifiers.x.toTree(),
    identifiers.y.toTree(),
    identifiers.z.toTree(),
  );
  const correctAnswer = u.getNorm();
  return correctAnswer.simplify().toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const u = new SpaceVector(
    "u",
    identifiers.x.toTree(),
    identifiers.y.toTree(),
    identifiers.z.toTree(),
  );
  return `Cacluler la norme du vecteur $${u.toTexWithCoords()}$`;
};

const getSpaceVectorNormCalculationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const u = SpaceVectorConstructor.random("u", false);
  const identifiers = {
    x: u.x.evaluate({}),
    y: u.y.evaluate({}),
    z: u.z.evaluate({}),
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: [],
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, x, y, z }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, (x + y + z).toTree().toTex());

  let sqrtRand;
  while (propositions.length < n) {
    sqrtRand = SquareRootConstructor.randomSimplifiable({});
    tryToAddWrongProp(propositions, sqrtRand.simplify().toTree().toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { x, y, z }) => {
  const correctAnswer = new SqrtNode((x ** 2 + y ** 2 + z ** 2).toTree());
  return correctAnswer
    .toAllValidTexs({ allowSimplifySqrt: true })
    .includes(ans);
};
export const spaceVectorNormCalculation: Exercise<Identifiers> = {
  id: "spaceVectorNormCalculation",
  label: "Calculer la norme d'un vecteur (dans l'espace)",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Vecteurs"],
  generator: (nb: number) =>
    getDistinctQuestions(getSpaceVectorNormCalculationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
  getHint,
  getCorrection,
  getAnswer,
  getInstruction,
};
