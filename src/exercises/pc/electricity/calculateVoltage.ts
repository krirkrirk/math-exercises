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

const getCalculateVoltageQuestion: QuestionGenerator<Identifiers> = () => {
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
  const R = randint(1, 51);
  const I = randfloat(0.1, 4, 2);
  const r = randint(1, 6);
  const E = randint(21, 51);
  const isAsking = ["du générateur", "de la résistance"];
  const instruction = `Dans un circuit électrique, on retrouve : 
  
  - Une source de tension $E=${E}$ volts, avec une resistance interne $r=${r}\\ \\Omega$. 

  - Un Conducteur ohmique de resistance $R=${R}\\ \\Omega$. 
  
  Un courant $I=${I}\\ A$ circule à travers la résistance. 
  
  Calculez la tension U aux bornes ${isAsking} en $V$. arrondie au centiéme`;

  const answer = (E - R * I).toFixed(0);

  return {
    instruction,
    answer: answer,
  };
};

export const calculateVoltage: Exercise<Identifiers> = {
  id: "calculateVoltage",
  label: "Calcul de tension au borne d'une résistance",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Électricité"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateVoltageQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
