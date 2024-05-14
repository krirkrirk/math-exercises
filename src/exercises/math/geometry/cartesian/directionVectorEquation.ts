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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Vector } from "#root/math/geometry/vector";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { VectorNode } from "#root/tree/nodes/geometry/vectorNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  xValue: number;
  yValue: number;
};

function parseVector(input: string): { x: number; y: number } | null {
  const tex = input.replace("\\left", "");
  const latex = tex.replace("\\right", "");
  const regex = /\((-?\d+)\s*[;,]\s*(-?\d+)\)/;
  const match = latex.match(regex);
  if (match && match.length === 3) {
    return {
      x: parseInt(match[1], 10),
      y: parseInt(match[2], 10),
    };
  }
  return null;
}

const getDirectionVectorEquationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  let x1 = randint(-8, 8);
  let x2 = randint(-8, 8);
  while (x2 === x1) {
    x2 = randint(-8, 8);
  }

  let y1 = randint(-8, 8);
  let y2 = randint(-8, 8);
  while (y2 === y1) {
    y2 = randint(-8, 8);
  }

  const xValue = x2 - x1;
  const yValue = y2 - y1;
  const c = randint(-5, 5);
  const vector = new Vector("v", xValue.toTree(), yValue.toTree());

  const equation = new EqualNode(
    new AddNode(
      new AddNode(
        new MultiplyNode(yValue.toTree(), new VariableNode("x")),
        new MultiplyNode((-xValue).toTree(), new VariableNode("y")),
      ).simplify({ forbidFactorize: true }),
      c.toTree(),
    ),
    new NumberNode(0),
  ).toTex();

  const question: Question<Identifiers> = {
    answer: vector.toInlineCoordsTex(),
    instruction: `Soit l'équation cartésienne $${equation}$. Déterminez les coordonnées d'un vecteur directeur $\\overrightarrow{v}$ de cette équation.`,
    keys: ["semicolon", "x", "y"],
    answerFormat: "tex",
    identifiers: { xValue, yValue },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, xValue, yValue },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const vector = new Vector("v", xValue.toTree(), yValue.toTree());

  const wrongAnswer1 = new Vector(
    "v",
    (xValue - 1).toTree(),
    (yValue - 1).toTree(),
  );
  const wrongAnswer2 = new Vector(
    "v",
    (xValue + 1).toTree(),
    (yValue + 1).toTree(),
  );
  const wrongAnswer3 = new Vector("v", yValue.toTree(), xValue.toTree());

  if (wrongAnswer1.isColinear(vector) === false) {
    tryToAddWrongProp(propositions, wrongAnswer1.toInlineCoordsTex());
  }
  if (wrongAnswer2.isColinear(vector) === false) {
    tryToAddWrongProp(propositions, wrongAnswer2.toInlineCoordsTex());
  }
  if (wrongAnswer3.isColinear(vector) === false) {
    tryToAddWrongProp(propositions, wrongAnswer3.toInlineCoordsTex());
  }

  while (propositions.length < n) {
    const wrongAnswer = new Vector(
      "v",
      randint(-5, 5).toTree(),
      randint(-5, 5).toTree(),
    );

    if (wrongAnswer.isColinear(vector) === false) {
      tryToAddWrongProp(propositions, wrongAnswer.toInlineCoordsTex());
    }
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, xValue, yValue }) => {
  const parsed = parseVector(ans);
  if (!parsed) {
    return false;
  }

  const { x, y } = parsed;

  const correctVector = new Vector("v", xValue.toTree(), yValue.toTree());
  const studentVector = new Vector("v", x.toTree(), y.toTree());

  if (!studentVector.isColinear(correctVector)) {
    return false;
  }

  return true;
};
export const directionVectorEquation: Exercise<Identifiers> = {
  id: "directionVectorEquation",
  label:
    "Coordonnées d'un vecteur directeur à partir d'une équation cartésienne",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie cartésienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getDirectionVectorEquationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
