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
import { gcd } from "#root/math/utils/arithmetic/gcd";
import { randint } from "#root/math/utils/random/randint";

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

function normalizeVector(x: number, y: number): { x: number; y: number } {
  const divisor = gcd(Math.abs(x), Math.abs(y));
  let newX = x / divisor;
  let newY = y / divisor;
  if (newX < 0) {
    newX = -newX;
    newY = -newY;
  }
  return { x: newX, y: newY };
}

const getDirectionVectorQuestion: QuestionGenerator<Identifiers> = () => {
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
  const rawXValue = x2 - x1;
  const rawYValue = y2 - y1;

  const { x: xValue, y: yValue } = normalizeVector(rawXValue, rawYValue);

  const vector = new Vector("v", xValue.toTree(), yValue.toTree());

  const instruction = `Lire les coordonnées d'un vecteur directeur de la droite représentée ci-dessous :`;
  const commands = [
    `line = Line((${x1}, ${y1}), (${x2}, ${y2}))`,
    `SetFixed(line, true)`,
  ];

  const xMin = Math.min(x1, x2);
  const yMin = Math.min(y1, y2);
  const xMax = Math.max(x1, x2);
  const yMax = Math.max(y1, y2);

  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
  });

  const question: Question<Identifiers> = {
    answer: vector.toInlineCoordsTex(),
    instruction,
    commands: ggb.commands,
    coords: [xMin - 10, xMax + 10, yMin - 10, yMax + 10],
    options: ggb.getOptions(),
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
    const randomX = randint(-5, 5);
    const randomY = randint(-5, 5);
    const { x: wrongX, y: wrongY } = normalizeVector(randomX, randomY);
    const wrongAnswer = new Vector("v", wrongX.toTree(), wrongY.toTree());

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

export const directionVector: Exercise<Identifiers> = {
  id: "directionVector",
  label: "Lire les coordonnées d'un vecteur directeur d'une droite",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie cartésienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getDirectionVectorQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
