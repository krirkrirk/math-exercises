import {
  shuffleProps,
  MathExercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QCMGenerator,
  QuestionGenerator,
  addValidProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
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

  const commands = [`Vector((${xA},${yA}), (${xB}, ${yB}))`];
  const xMin = Math.min(xA, xB);
  const yMin = Math.min(yA, yB);
  const xMax = Math.max(xA, xB);
  const yMax = Math.max(yA, yB);
  const coords = [
    xMin === xMax ? xMin - 1 : xMin - 0.2 * Math.abs(xDelta),
    xMin === xMax ? xMax + 1 : xMax + 0.2 * Math.abs(xDelta),
    yMin === yMax ? yMin - 1 : yMin - 0.2 * Math.abs(yDelta),
    yMin === yMax ? yMax + 1 : yMax + 0.2 * Math.abs(yDelta),
  ];

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Lire les coordonnées du vecteur $\\overrightarrow u$ représenté ci-dessous :`,
    keys: ["semicolon", "vectorU"],
    answerFormat: "tex",
    commands,
    coords,
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

export const coordinatesReading: MathExercise<Identifiers> = {
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
};
