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
import { SpaceVectorConstructor } from "#root/math/geometry/spaceVector";
import { VectorConstructor } from "#root/math/geometry/vector";
import { SquareRootConstructor } from "#root/math/numbers/reals/real";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";

type Identifiers = {
  x: number;
  y: number;
  z: number;
};

const getSpaceVectorNormCalculationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const u = SpaceVectorConstructor.random("u", false);
  const correctAnswer = u.getNorm();

  const question: Question<Identifiers> = {
    answer: correctAnswer.simplify().toTex(),
    instruction: `Cacluler la norme du vecteur $${u.toTexWithCoords()}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      x: u.x.evaluate({}),
      y: u.y.evaluate({}),
      z: u.z.evaluate({}),
    },
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
};
