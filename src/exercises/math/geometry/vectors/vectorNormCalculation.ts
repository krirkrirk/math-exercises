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
import { randint } from "#root/math/utils/random/randint";
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
  const correctAnswer = new SqrtNode(
    new AddNode(
      new SquareNode(new NumberNode(x)),
      new SquareNode(new NumberNode(y)),
    ),
  );

  const question: Question<Identifiers> = {
    answer: correctAnswer.simplify().toTex(),
    instruction: `Cacluler la norme du vecteur $${u.toTex()}${u.toInlineCoordsTex()}$`,
    keys: ["sqrt", "power"],
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
  let generatedProposition;
  while (propositions.length < n) {
    generatedProposition = generateProposition(
      randint(x - 3, x + 4, [x]),
      randint(y - 3, y + 4, [y]),
    );
    generatedProposition.forEach((value) =>
      tryToAddWrongProp(propositions, value.simplify().toTex()),
    );
  }
  return shuffleProps(propositions, n);
};

const generateProposition = (x: number, y: number): AlgebraicNode[] => {
  let xNode = new NumberNode(x);
  let yNode = new NumberNode(y);

  const firstPropostion = new AddNode(
    new SquareNode(xNode),
    new SquareNode(yNode),
  );

  const secondProposition = new SqrtNode(
    new SquareNode(new AddNode(xNode, yNode)),
  );

  const thirdProposition = new AddNode(xNode, yNode);

  return [firstPropostion, secondProposition, thirdProposition];
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
  label: "Calculer la norme d'un vecteur $\\overrightarrow{u}$",
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
