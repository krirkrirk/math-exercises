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

const getPointCoordinatesNoAxisNumbersQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const x = randint(-10, 10);
  const y = randint(-10, 10);

  let xMin = x - 2;
  let xMax = x + 2;
  let yMin = y - 2;
  let yMax = y + 2;

  yMax = yMax < 2 ? 2 : yMax;
  yMin = yMin > -2 ? -2 : yMin;
  xMin = xMin > -2 ? -2 : xMin;
  xMax = xMax < 2 ? 2 : xMax;

  const instruction = `Lire les coordonnées du point $A$ représenté dans le repère ci-dessous : `;

  const commands = [
    `A = (${x}, ${y})`,
    `ShowLabel(A, true)`,
    "SetPointStyle(A, 1)",

    `SetPointSize(A, 4)`,
    `SetFixed(A, true)`,
    "O = (0,0)",
    `SetFixed(O, true)`,
    `ShowLabel(O, true)`,
    `SetPointSize(O, 4)`,

    "I = (1,0)",
    `SetFixed(I, true)`,
    `ShowLabel(I, true)`,
    `SetPointSize(I, 4)`,

    "J = (0,1)",
    `SetFixed(J, true)`,
    `ShowLabel(J, true)`,
    `SetPointSize(J, 4)`,
  ];

  const ggb = new GeogebraConstructor({
    commands,
    xAxis: {
      hideNumbers: true,
    },
    yAxis: {
      hideNumbers: true,
    },
  });

  const A = new Point("A", x.toTree(), y.toTree());

  const question: Question<Identifiers> = {
    answer: A.toCoords(),
    instruction,
    ggbOptions: ggb.getOptions({
      coords: ggb.getAdaptedCoords({
        xMin,
        xMax,
        yMin,
        yMax,
        forceShowAxes: true,
      }),
    }),
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

export const pointCoordinatesNoAxisNumbers: Exercise<Identifiers> = {
  id: "pointCoordinatesNoAxisNumbers",
  label: "Lire les coordonnées d'un point (sans nombres sur les axes)",
  levels: ["1rePro"],
  isSingleStep: true,
  sections: ["Géométrie cartésienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getPointCoordinatesNoAxisNumbersQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasGeogebra: true,
};
