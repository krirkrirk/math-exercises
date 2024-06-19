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
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  frequency1: number;
  frequency2: number;
  soundAsked: number;
};

const getFrequencyComparisonQuestion: QuestionGenerator<Identifiers> = () => {
  const soundAsked = coinFlip() ? 1 : 2;
  const soundCompared = soundAsked === 1 ? 2 : 1;
  const frequency1 = randint(20, 1000);
  const frequency2 = randint(20, 1000, [frequency1]);
  const highestFrequency = frequency1 > frequency2 ? 1 : 2;
  const answer =
    soundAsked === highestFrequency
      ? `Plus aigu que le son ${soundCompared}`
      : `Plus grave que le son ${soundCompared}`;

  const question: Question<Identifiers> = {
    answer,
    instruction: `La fréquence de deux sons sont $f_1 = ${frequency1}\\ \\text{Hz}$ et $f_2 = ${frequency2}\\ \\text{Hz}$. Le son ${soundAsked} est :`,
    keys: [],
    answerFormat: "raw",
    identifiers: { frequency1, frequency2, soundAsked },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, soundAsked },
) => {
  const propositions: Proposition[] = [];
  const soundCompared = soundAsked === 1 ? 2 : 1;
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(
    propositions,
    `Plus aigu que le son ${soundCompared}`,
    "raw",
  );
  tryToAddWrongProp(
    propositions,
    `Plus grave que le son ${soundCompared}`,
    "raw",
  );
  tryToAddWrongProp(
    propositions,
    `Aussi aigu que le son ${soundCompared}`,
    "raw",
  );
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const frequencyComparison: Exercise<Identifiers> = {
  id: "frequencyComparison",
  label: "Comparer deux fréquences sonores",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Son"],
  generator: (nb: number) =>
    getDistinctQuestions(getFrequencyComparisonQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
  answerType: "QCU",
};
