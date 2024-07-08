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
import { random } from "#root/utils/random";

type Identifiers = {
  E: number;
  I: number;
  r: number;
  R: number;
  isAsking: string;
};

const getCalculateVoltageQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExercise();
  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: exo.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      E: exo.E,
      I: exo.I,
      r: exo.r,
      R: exo.R,
      isAsking: exo.isAsking,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, E, I, R, r, isAsking },
) => {
  const propositions: Proposition[] = [];
  const correctAns = +getCorrectAnswer(isAsking, E, I, r, R).toFixed(0);
  addValidProp(propositions, answer);
  generatePropositions(E, I, r, R, isAsking).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  while (propositions.length < n) {
    let random = randint(correctAns - 10, correctAns + 11, [correctAns]);
    tryToAddWrongProp(propositions, random.frenchify());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, isAsking, E, I, r, R },
) => {
  const scientificAns = getCorrectAnswer(isAsking, E, I, r, R).toScientific(0);
  return [answer, scientificAns].includes(ans);
};

const generatePropositions = (
  E: number,
  I: number,
  r: number,
  R: number,
  isAsking: string,
): string[] => {
  const first =
    isAsking === "du générateur"
      ? (+(R * I).toFixed(0)).frenchify()
      : (+(E - r * I).toFixed(0)).frenchify();
  const second = E.frenchify();
  return [first, second];
};

const generateExercise = () => {
  const R = randint(1, 51);
  const I = randfloat(0.1, 4, 1);
  const r = randint(1, 6);
  const E = randint(21, 51);
  const isAsking = random(["du générateur", "de la résistance"]);
  const instruction = `Dans un circuit électrique, on trouve : 
  
  - Une source de tension $E=${E}$ volts, avec une resistance interne $r=${r}\\ \\Omega$. 

  - Un Conducteur ohmique de resistance $R=${R}\\ \\Omega$. 
  
  - Un courant $I=${I.frenchify()}\\ A$ circule à travers la résistance. 
  
  Calculez la tension U aux bornes ${isAsking} en $V$, arrondie à l'unité`;

  const answer = +getCorrectAnswer(isAsking, E, I, r, R).toFixed(0);

  return {
    instruction,
    answer: answer.frenchify(),
    isAsking,
    E,
    I,
    r,
    R,
  };
};

const getCorrectAnswer = (
  isAsking: string,
  E: number,
  I: number,
  r: number,
  R: number,
): number => {
  return isAsking === "du générateur" ? E - r * I : R * I;
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
