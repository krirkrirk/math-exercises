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
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { frenchify } from "#root/math/utils/latex/frenchify";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";

type Identifiers = {
  b: number;
  secondPoint: number[];
};

const getInterceptReadingQuestion: QuestionGenerator<Identifiers> = () => {
  const b = randint(-5, 6);
  const secondPoint = [randint(-5, 6, [0]), randint(-5, 6)];
  const answer = b + "";

  let xMin = Math.min(0, secondPoint[0]);
  let xMax = Math.max(0, secondPoint[0]);
  let yMin = Math.min(b, secondPoint[1]);
  let yMax = Math.max(b, secondPoint[1]);

  const commands = [
    `l = Line((0, ${b}), (${secondPoint[0]}, ${secondPoint[1]}))`,
    `SetColor(l, "${randomColor()}")`,
  ];
  const ggb = new GeogebraConstructor(commands, {
    gridDistance: [1, 1],
    isGridSimple: true,
  });
  const question: Question<Identifiers> = {
    answer,
    instruction: `Ci-dessous est tracée la courbe représentative d'une fonction affine $f$. Déterminer graphiquement l'ordonnée à l'origine $b$ de la fonction $f$.`,
    keys: [],
    commands: ggb.commands,
    coords: ggb.getAdaptedCoords({ xMin, xMax, yMin, yMax }),
    options: ggb.getOptions(),
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
  const a = (secondPoint[1] - b) / secondPoint[0];
  if (a !== 0) {
    const root = -b / a;
    tryToAddWrongProp(propositions, frenchify(round(root, 2)));
  }

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-5, 6) + "");
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, secondPoint, b }) => {
  return ans === answer;
};
export const interceptReading: Exercise<Identifiers> = {
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
  hasGeogebra: true,
  subject: "Mathématiques",
};
