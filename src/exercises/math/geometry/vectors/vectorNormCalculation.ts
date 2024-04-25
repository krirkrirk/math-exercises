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
};

const getVectorNormCalculationQuestion: QuestionGenerator<Identifiers> = () => {
  const u = VectorConstructor.random("u", false);
  const x = (u.x.simplify() as NumberNode).value;
  const y = (u.y.simplify() as NumberNode).value;
  const correctAnswer = u.getNorm();

  const question: Question<Identifiers> = {
    answer: correctAnswer.simplify().toTex(),
    instruction: `Cacluler la norme du vecteur $${u.toTexWithCoords()}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { x, y },
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

  const firstProposition = new SqrtNode(
    new SquareNode(new AddNode(xNode, yNode)),
  );

  return [firstProposition];
};

const isAnswerValid: VEA<Identifiers> = (ans, { x, y }) => {
  const correctAnswer = new SqrtNode(
    new AddNode(
      new SquareNode(new NumberNode(x)),
      new SquareNode(new NumberNode(y)),
    ),
  );
  return correctAnswer.simplify().toAllValidTexs().includes(ans);
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
};
