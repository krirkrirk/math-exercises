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

type Identifiers = {};

const getCalculateResistanceQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExercise();
  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: exo.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {}
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generatePropositions = (uED: number, iEC: number): string[] => {
  const first = (uED / iEC).toFixed(0);
  const second = (uED * iEC).toFixed(0);
  return [first, second];
};

const generateExercise = () => {
  const R = randint(1, 11);
  const I = randint(1, 6);
  const E = randint(R * I + 5, R * I + 29);
  const instruction = `Dans un circuit électrique, une source de tension $E=${E}$ volts est connectée à une résistance $R=${R}\\ \\Omega$. 
  
  Un courant $I=${I}\\ A$ circule à travers la résistance. Calculez la tension U aux bornes de la résistance en $V$.`;

  const answer = (E - R * I).toFixed(0);

  return {
    instruction,
    answer: answer,
  };
};

export const calculateResistance: Exercise<Identifiers> = {
  id: "calculateResistance",
  label: "Calcul de résistance",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Électricité"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateResistanceQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
