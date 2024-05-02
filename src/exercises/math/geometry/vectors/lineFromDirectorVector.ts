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
import { Line } from "#root/math/geometry/line";
import { Point, PointConstructor } from "#root/math/geometry/point";
import { Vector, VectorConstructor } from "#root/math/geometry/vector";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  uX: number;
  uY: number;
  aX: number;
  aY: number;
};

const getLineFromDirectorVectorQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = PointConstructor.random("A");
  const u = new Vector(
    "u",
    new NumberNode(randint(-10, 11, [0])),
    new NumberNode(randint(-10, 11, [0])),
  );

  const b = new Point(
    "b",
    new NumberNode(a.getXnumber() - u.getXAsNumber()),
    new NumberNode(a.getYnumber() - u.getYAsNumber()),
  );
  const line = new Line(b, a);
  const correctAnswer = line.getEquation(u, a);

  const instruction = `Soit $d$ une droite de vecteur directeur $${u.toTexWithCoords()}$ passant par le point $${a.toTexWithCoords()}$. Déterminer l'équation rédiute de la droite $d$`;

  const question: Question<Identifiers> = {
    answer: correctAnswer.toTex(),
    instruction: instruction,
    keys: ["x", "y", "equal"],
    answerFormat: "tex",
    identifiers: {
      uX: u.getXAsNumber(),
      uY: u.getYAsNumber(),
      aX: a.getXnumber(),
      aY: a.getYnumber(),
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, uX, uY, aX, aY },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(uX, uY, aX, aY).forEach((value) =>
    tryToAddWrongProp(propositions, value.toTex()),
  );
  let uXRand;
  let uYRand;
  while (propositions.length < n) {
    uXRand = randint(-10, 11, [0, uX]);
    uYRand = randint(-10, 11, [0, uY]);
    tryToAddWrongProp(
      propositions,
      getCorrecAnswer(uXRand, uYRand, aX, aY).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { uX, uY, aX, aY }) => {
  const correctAnswer = getCorrecAnswer(uX, uY, aX, aY);
  return correctAnswer
    .toAllValidTexs({ allowRawRightChildAsSolution: true })
    .includes(ans);
};

const generatePropositions = (
  uX: number,
  uY: number,
  aX: number,
  aY: number,
) => {
  const y = new VariableNode("y");
  const x = new VariableNode("x");
  const uXNode = new NumberNode(uX);
  const uYNode = new NumberNode(uY);
  const aYNode = new NumberNode(aY);
  const aXNode = new NumberNode(aX);
  const firstProposition = getFirstProposition(
    y,
    x,
    uXNode,
    uYNode,
    aYNode,
    aXNode,
  );
  const secondProposition = getSecondProposition(
    y,
    x,
    uXNode,
    uYNode,
    aXNode,
    aYNode,
  );
  return [firstProposition, secondProposition];
};

const getFirstProposition = (
  y: VariableNode,
  x: VariableNode,
  uX: NumberNode,
  uY: NumberNode,
  aX: NumberNode,
  aY: NumberNode,
) => {
  const uYDivuX = new FractionNode(uY, uX).simplify();
  const natural = uY.value % uX.value === 0;
  const aYuX = new MultiplyNode(aY, uX).simplify();
  const aXuY = new MultiplyNode(aX, uY).simplify();
  const rightSide = new AddNode(
    natural
      ? new MultiplyNode(uYDivuX, x).simplify()
      : new MultiplyNode(uYDivuX, x),
    new FractionNode(new SubstractNode(aXuY, aYuX).simplify(), uX).simplify(),
  );
  const equation = new EqualNode(y, rightSide);
  return equation;
};
const getSecondProposition = (
  y: VariableNode,
  x: VariableNode,
  uX: NumberNode,
  uY: NumberNode,
  aX: NumberNode,
  aY: NumberNode,
) => {
  const uYDivuX = new FractionNode(uX, uY).simplify();
  const natural = uX.value % uY.value === 0;
  const aYuX = new MultiplyNode(aY, aX).simplify();
  const aXuY = new MultiplyNode(uX, uY).simplify();
  const rightSide = new AddNode(
    natural
      ? new MultiplyNode(uYDivuX, x).simplify()
      : new MultiplyNode(uYDivuX, x),
    new SubstractNode(aYuX, aXuY).simplify(),
  );
  const equation = new EqualNode(y, rightSide);
  return equation;
};

const getCorrecAnswer = (uX: number, uY: number, aX: number, aY: number) => {
  const y = new VariableNode("y");
  const uXNode = new NumberNode(uX);
  const uYNode = new NumberNode(uY);
  const aYNode = new NumberNode(aY);
  const aXNode = new NumberNode(aX);

  const uYDivuX = new FractionNode(uYNode, uXNode).simplify();
  const natural = uY % uX === 0;
  const aYuX = new MultiplyNode(aYNode, uXNode).simplify();
  const aXuY = new MultiplyNode(aXNode, uYNode).simplify();
  const rightSide = new AddNode(
    natural
      ? new MultiplyNode(uYDivuX, new VariableNode("x")).simplify()
      : new MultiplyNode(uYDivuX, new VariableNode("x")),
    new FractionNode(
      new SubstractNode(aYuX, aXuY).simplify(),
      uXNode,
    ).simplify(),
  );
  const equation = new EqualNode(y, rightSide);
  return equation;
};
export const lineFromDirectorVector: Exercise<Identifiers> = {
  id: "lineFromDirectorVector",
  label:
    "Équation cartésienne de droite connaissant un point et un vecteur directeur",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Droites"],
  generator: (nb: number) =>
    getDistinctQuestions(getLineFromDirectorVectorQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
