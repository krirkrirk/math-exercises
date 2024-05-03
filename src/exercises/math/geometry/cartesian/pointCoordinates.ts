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
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {};

function generatePoint(): String {
  const x = randint(-10, 10);
  const y = randint(-10, 10);
  return `(${x}, ${y})`;
}
const getPointCoordinatesQuestion: QuestionGenerator<Identifiers> = () => {
  const point = generatePoint();
  const buffer = 5; // Marge supplémentaire autour du point le plus extrême

  const xMin = Math.min(point.x) - buffer;
  const xMax = Math.max(point.x) + buffer;
  const yMin = Math.min(point.y) - buffer;
  const yMax = Math.max(point.y) + buffer;

  const instruction = `Déterminez les coordonnées du point marqué sur le repère ci-dessous.`;

  const commands = [
    `PointA = (${point.x}, ${point.y})`,
    `SetVisibleInView(PointA, 1, true)`,
    `SetCoords(PointA, ${point.x}, ${point.y})`,
    `SetPointStyle(PointA, 1)`,
    `SetPointSize(PointA, 5)`,
    `SetFixed(PointA, true)`,
    `ZoomIn(${xMin}, ${yMin}, ${xMax}, ${yMax})`,
  ];

  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
    isAxesRatioFixed: false,
  });

  const question: Question<Identifiers> = {
    answer: `(${point.x}, ${point.y})`,
    commands: ggb.commands,
    instruction,
    options: ggb.getOptions(),
    keys: [],
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "tex");

  // Génération de propositions incorrectes
  for (let i = 0; i < 3; i++) {
    const wrongAnswer = `(${randint(-10, 10)}, ${randint(-10, 10)})`;
    if (wrongAnswer !== answer) {
      tryToAddWrongProp(propositions, wrongAnswer, "tex");
    }
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
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
