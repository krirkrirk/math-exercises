import {
  ScienceExercise,
  Proposition,
  Question,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/exercises/utils/math/random/randint";
import { round } from "#root/exercises/utils/math/round";
import { shuffle } from "#root/exercises/utils/shuffle";
import { v4 } from "uuid";

type Identifiers = {
  randomNumber: number;
  randomTenPower: number;
};
const getpH: QuestionGenerator<Identifiers> = () => {
  const randomNumber = randint(1, 10);
  const randomTenPower = randint(2, 10);

  const concentrationHydrogene = randomNumber * 10 ** -randomTenPower;

  const instruction = `Calculer le pH d'une solution ayant une concentration en ions hydrogène ($H^+$) de $${randomNumber} \\times 10^{-${randomTenPower}}$ mol/L.`;
  const answer = round(-Math.log10(concentrationHydrogene), 1) + "";
  const question: Question<Identifiers> = {
    instruction,
    startStatement: `pH`,
    answer,
    keys: ["log"],
    answerFormat: "tex",
    identifiers: { randomNumber, randomTenPower },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const randomNumber = randint(1, 10);
    const randomTenPower = randint(2, 10);
    const concentrationHydrogene = randomNumber * 10 ** -randomTenPower;
    const wrongAnswer = round(-Math.log10(concentrationHydrogene), 1) + "";
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const pH: ScienceExercise<Identifiers> = {
  id: "pH",
  connector: "=",
  label: "Calculer le pH d'une solution",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Acide / Base"],
  subject: "Chimie",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getpH, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
