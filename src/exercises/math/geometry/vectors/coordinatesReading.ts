import {
  shuffleProps,
  Exercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QCMGenerator,
  QuestionGenerator,
  addValidProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { IntegerConstructor } from "#root/math/numbers/integer/integer";
import { randint } from "#root/math/utils/random/randint";
import { v4 } from "uuid";
type Identifiers = {
  xA: number;
  xB: number;
  yA: number;
  yB: number;
};

const getCoordinatesReadingQuestion: QuestionGenerator<Identifiers> = () => {
  const [xA, yA] = IntegerConstructor.randomDifferents(-5, 6, 2);
  let xB: number, yB: number;
  do {
    [xB, yB] = IntegerConstructor.randomDifferents(-5, 6, 2);
  } while (xA === xB && yA === yB);

  const xDelta = xB - xA;
  const yDelta = yB - yA;
  const answer = `\\left(${xDelta};${yDelta}\\right)`;

  const commands = [
    `u = Vector((${xA},${yA}), (${xB}, ${yB}))`,
    'SetCaption(u, "$\\overrightarrow u$")',
    "ShowLabel(u, true)",
    `SetColor(u, "${randomColor()}")`,
  ];
  const xMin = Math.min(xA, xB);
  const yMin = Math.min(yA, yB);
  const xMax = Math.max(xA, xB);
  const yMax = Math.max(yA, yB);

  const ggb = new GeogebraConstructor({
    commands,
    isGridBold: true,
  });
  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Lire les coordonnées du vecteur $\\overrightarrow u$ représenté ci-dessous :`,
    keys: ["semicolon", "vectorU"],
    answerFormat: "tex",
    ggbOptions: ggb.getOptions({
      coords: ggb.getAdaptedCoords({ xMax, xMin, yMax, yMin }),
    }),
    identifiers: { xA, xB, yA, yB },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, xA, xB, yA, yB },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, `\\left(${xA - xB};${yA - yB}\\right)`);
  tryToAddWrongProp(propositions, `\\left(${xA + xB};${yA + yB}\\right)`);
  tryToAddWrongProp(propositions, `\\left(${xA - yA};${xB - yB}\\right)`);
  tryToAddWrongProp(propositions, `\\left(${yA - xA};${yB - xB}\\right)`);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      `\\left(${randint(-10, 10)};${randint(-10, 10)}\\right)`,
    );
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [answer, "\\overrightarrow{u}" + answer].includes(ans);
};

export const coordinatesReading: Exercise<Identifiers> = {
  id: "coordinatesReading",
  connector: "=",
  label: "Lire les coordonnées d'un vecteur",
  levels: ["2nde", "1reESM"],
  isSingleStep: true,
  sections: ["Vecteurs"],
  generator: (nb: number) =>
    getDistinctQuestions(getCoordinatesReadingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
