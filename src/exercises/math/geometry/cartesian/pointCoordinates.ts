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
import { Point, PointConstructor } from "#root/math/geometry/point";
import { randint } from "#root/math/utils/random/randint";
import { PointNode } from "#root/tree/nodes/geometry/pointNode";

type Identifiers = {
  x: number;
  y: number;
};

const getPointCoordinatesQuestion: QuestionGenerator<Identifiers> = () => {
  const x = randint(-10, 10);
  const y = randint(-10, 10);

  const xMin = Math.min(x) - 5;
  const xMax = Math.max(x) + 5;
  const yMin = Math.min(y) - 5;
  const yMax = Math.max(y) + 5;

  const instruction = `Déterminez les coordonnées du point A dans le repère ci-dessous : `;

  const commands = [
    `A = (${x}, ${y})`,
    `ShowLabel(A, true)`,
    `SetVisibleInView(A, 1, true)`,
    `SetCoords(A, ${x}, ${y})`,
    `SetPointStyle(A, 0)`,
    `SetPointSize(A, 5)`,
    `SetFixed(A, true)`,
    `ZoomIn(${xMin}, ${yMin}, ${xMax}, ${yMax})`,
  ];

  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
    isAxesRatioFixed: true,
  });

  const A = new Point("A", x.toTree(), y.toTree());

  const question: Question<Identifiers> = {
    answer: A.toCoords(),
    commands: ggb.commands,
    instruction,
    options: ggb.getOptions(),
    coords: [xMin, xMax, yMin, yMax],
    keys: ["x", "y", "semicolon"],
    answerFormat: "tex",
    identifiers: { x, y },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, x, y }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "tex");

  const points = [
    new Point("A", (x + 1).toTree(), (y + 1).toTree()),
    new Point("A", (x - 1).toTree(), (y - 1).toTree()),
    new Point("A", (x - 1).toTree(), (y + 1).toTree()),
    new Point("A", (x + 1).toTree(), (x - 1).toTree()),
  ];

  points.forEach((point) => tryToAddWrongProp(propositions, point.toCoords()));

  while (propositions.length < n) {
    const wrongAnswer = new Point(
      "A",
      randint(-10, 10).toTree(),
      randint(-10, 10).toTree(),
    );
    tryToAddWrongProp(propositions, wrongAnswer.toCoords(), "tex");
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, x, y }) => {
  const valid = new Point("A", x.toTree(), y.toTree()).toCoords();
  return ans === valid;
};

export const pointCoordinates: Exercise<Identifiers> = {
  id: "pointCoordinates",
  label: "Déterminer les coordonnées d'un point dans un repère",
  levels: ["1rePro"],
  isSingleStep: true,
  sections: ["Géométrie cartésienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getPointCoordinatesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
