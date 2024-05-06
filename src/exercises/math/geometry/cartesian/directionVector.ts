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
import { VectorNode } from "#root/tree/nodes/geometry/vectorNode";

type Identifiers = {};

const getDirectionVectorQuestion: QuestionGenerator<Identifiers> = () => {
  const x1 = randint(-10, 10);
  const x2 = randint(-10, 10);
  const y1 = randint(-10, 10);
  const y2 = randint(-10, 10);

  const xValue = x2 - x1;
  const yValue = y2 - y1;

  const vector = new Vector("V", xValue.toTree(), yValue.toTree());

  const instruction = `Soit la droite tracée ci-dessous dans le plan cartésien. Déterminez un vecteur directeur $\\overrightarrow{V}$ de cette droite.`;
  const commands = [
    `A = (${x1}, ${y1})`,
    `B = (${x2}, ${y2})`,
    `Ligne = Line(A, B)`,
  ];

  const xMin = Math.min(x1, x2);
  const yMin = Math.min(y1, y2);
  const xMax = Math.max(x1, x2);
  const yMax = Math.max(y1, y2);

  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
  });

  const question: Question<Identifiers> = {
    answer: vector.toTex(),
    instruction,
    commands: ggb.commands,
    coords: [xMin - 5, xMax + 5, yMin - 5, yMax + 5],
    options: ggb.getOptions(),
    keys: [
      "equal",
      "V",
      "overrightarrow",
      "leftParenthesis",
      "rightParenthesis",
      "semicolon",
    ],
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};
export const directionVector: Exercise<Identifiers> = {
  id: "directionVector",
  label: "Coordonnées d'un vecteur directeur d'une droite",
  levels: ["2nde"],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getDirectionVectorQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
