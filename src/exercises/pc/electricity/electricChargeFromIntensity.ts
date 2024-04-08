import { roundSignificant } from "#root/math/utils/round";
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
import { randint } from "#root/math/utils/random/randint";
import { randfloat } from "#root/math/utils/random/randfloat";

type Identifiers = { intensity: number; seconds: number };

const getElectricChargeFromIntensityQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const intensity = randfloat(0, 6, 1);
  const seconds = randint(1, 30);

  const electricCharge = intensity * seconds;

  const question: Question<Identifiers> = {
    answer: roundSignificant(electricCharge, 1),
    instruction: `Un conducteur électrique est parcouru par un courant d'intensité $${roundSignificant(
      intensity,
      1,
    )}\\ \\text{A}$. Calculer la charge électrique $\\text{Q (en C)}$ ayant traversé la section de ce conducteur durant $${seconds}\\ \\text{s}$.`,
    keys: [],
    answerFormat: "tex",
    identifiers: { intensity, seconds },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, intensity, seconds },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const electricCharge = intensity * seconds;
  const firstDivision = intensity / seconds;
  const secondDivision = seconds / intensity;
  tryToAddWrongProp(propositions, `${roundSignificant(firstDivision, 1)}`);
  tryToAddWrongProp(propositions, `${roundSignificant(secondDivision, 1)}`);
  tryToAddWrongProp(
    propositions,
    `${roundSignificant(electricCharge * 0.1, 1)}`,
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      `${randfloat(0, electricCharge, 1).frenchify()}`,
    );
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const electricChargeFromIntensity: Exercise<Identifiers> = {
  id: "electricChargeFromIntensity",
  label: "Calculer une charge électrique",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Électricité"],
  generator: (nb: number) =>
    getDistinctQuestions(getElectricChargeFromIntensityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
