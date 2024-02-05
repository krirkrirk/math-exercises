import {
  MathExercise,
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
import { Rational } from "#root/math/numbers/rationals/rational";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  b: number;
  secondPoint: number[];
};

const getInterceptReadingQuestion: QuestionGenerator<Identifiers> = () => {
  const b = randint(-5, 6);
  const secondPoint = [randint(-5, 6, [0]), randint(-5, 6)];
  const answer = b + "";

  let xMin = Math.min(0, secondPoint[0]);
  if (xMin > 0) xMin = -0.5;
  let xMax = Math.max(0, secondPoint[0]);
  if (xMax < 0) xMax = 0.5;
  let yMin = Math.min(b, secondPoint[1]);
  if (yMin > 0) yMin = -0.5;
  let yMax = Math.max(b, secondPoint[1]);
  if (yMax < 0) yMax = 0.5;

  const coords = [xMin - 1, xMax + 1, yMin - 1, yMax + 1];
  const question: Question<Identifiers> = {
    answer,
    instruction: `Ci-dessous est tracée la courbe représentative d'une fonction affine $f$. Déterminer graphiquement l'ordonnée à l'origine $b$ de la fonction $f$.`,
    keys: [],
    commands: [`Line((0, ${b}), (${secondPoint[0]}, ${secondPoint[1]}))`],
    coords,
    answerFormat: "tex",
    identifiers: { b, secondPoint },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, b, secondPoint },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-5, 6) + "");
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, secondPoint, b }) => {
  return ans === answer;
};
export const interceptReading: MathExercise<Identifiers> = {
  id: "interceptReading",
  connector: "=",
  label: "Lire graphiquement l'ordonnée à l'origine",
  levels: ["2nde", "1reESM", "1rePro", "1reSpé", "1reTech"],
  isSingleStep: true,
  sections: ["Droites", "Fonctions affines"],
  generator: (nb: number) =>
    getDistinctQuestions(getInterceptReadingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
