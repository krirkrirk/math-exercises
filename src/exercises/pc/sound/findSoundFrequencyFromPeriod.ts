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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";

type Identifiers = {
  period: number;
};

const getFindSoundFrequencyFromPeriodQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const period = round(randfloat(1, 50), 1);
  const periodInSeconds = period / 1000;
  const answer = `${round(1 / periodInSeconds, 0)}`;

  const question: Question<Identifiers> = {
    answer,
    instruction: `Un signal sonore a une période de $${period}\\ \\text{ms}$. Calculer la fréquence de ce signal en $\\text{Hz}$ (arrondir à l'unité).`,
    keys: [],
    answerFormat: "tex",
    identifiers: { period },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, period }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const answerFromPeriodInMs = `${round(1 / period, 0)}`;
  const answerWithWrongConversion = `${round(1 / (period / 100), 0)}`;
  const answerWithWrongConversion2 = `${round(1 / (period / 10000), 0)}`;
  tryToAddWrongProp(propositions, answerFromPeriodInMs);
  tryToAddWrongProp(propositions, answerWithWrongConversion);
  tryToAddWrongProp(propositions, answerWithWrongConversion2);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, `${randint(0, 1000)}`);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const findSoundFrequencyFromPeriod: Exercise<Identifiers> = {
  id: "findSoundFrequencyFromPeriod",
  label: "Calculer la fréquence d'un signal sonore en fonction de la période",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Son"],
  generator: (nb: number) =>
    getDistinctQuestions(getFindSoundFrequencyFromPeriodQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
