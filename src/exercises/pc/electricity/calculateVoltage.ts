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
    correction: exo.correction,
    hint: exo.hint,
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
  const first = E.frenchify();
  let second: string = (0).frenchify();
  switch (isAsking) {
    case "du générateur":
      second = (+getCorrectAnswer("de la résistance", E, I, r, R).toFixed(
        0,
      )).frenchify();
      break;
    case "de la résistance":
      second = (+getCorrectAnswer("du générateur", E, I, r, R).toFixed(
        0,
      )).frenchify();
      break;
    case "de la diode":
      second = (+(
        getCorrectAnswer("de la résistance", E, I, r, R) +
        getCorrectAnswer("du générateur", E, I, r, R)
      ).toFixed(0)).frenchify();
      break;
  }
  return [first, second];
};

const generateExercise = () => {
  const R = randint(1, 21);
  const I = randfloat(0.1, 4, 1);
  const r = randint(1, 6);
  const EMin = Math.floor(r * I + R * I);
  const E = randint(EMin + 5, EMin + 51);
  const isAsking = random(["du générateur", "de la résistance", "de la diode"]);
  const instruction = `Dans un circuit électrique, on trouve : 
  
  - Une source de tension $E=${E}$ volts, avec une résistance interne $r=${r}\\ \\Omega$. 

  - Un conducteur ohmique de résistance $R=${R}\\ \\Omega$. 
  
  - Un courant $I=${I.frenchify()}\\ A$ circule à travers la résistance. 
  
  Calculez la tension U aux bornes ${isAsking} en $V$, arrondie à l'unité   
  ![](https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/activities/quizzes/generator/electricCircuit1NoLetters.png)`;

  const answer = getCorrectAnswer(isAsking, E, I, r, R).toFixed(0);
  const correction = getCorrection(isAsking, answer);
  const hint = getHint(isAsking);

  return {
    instruction,
    answer: answer,
    correction,
    hint,
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
  switch (isAsking) {
    case "du générateur":
      return E - r * I;
    case "de la résistance":
      return R * I;
    case "de la diode":
      const U1 = E - r * I;
      const U2 = R * I;
      return U1 - U2;
    default:
      return 0;
  }
};

const getHint = (isAsking: string): string => {
  switch (isAsking) {
    case "de la diode":
      return `Calculer d'abord la tension aux bornes du conducteur ohmique et du générateur, puis appliquer la loi des mailles.`;
    case "du générateur":
      return `Appliquer la formule qui met en relation la tension $U$ aux bornes du générateur, la résistance interne du générateur $r$ et l'intensité $I$.`;
    case "de la résistance":
      return `Appliquer la loi d'ohm.`;
    default:
      return "";
  }
};

const getCorrection = (isAsking: string, answer: string) => {
  switch (isAsking) {
    case "du générateur":
      return `Appliquer la formule qui met en relation la tension $U$ aux bornes du générateur, la résistance interne du générateur $r$ et l'intensité $I$.\n
$U=E-r \\cdot I\\ \\Rightarrow\\ U=${answer}\\ V$`;
    case "de la résistance":
      return `Appliquer la loi d'ohm : $U=R \\cdot I\\ \\Rightarrow\\ U=${answer}\\ V$`;
    case "de la diode":
      return `1 - Calculer la tension aux bornes du générateur $U=E-r \\cdot I$.\n
2 - Calculer la tension aux bornes du conducteur ohmique $U_1=R \\cdot I$.\n
3 - Appliquer la loi des mailles $U=U_1+U_2\\ \\Rightarrow\\ U_2=U-U_1\\ \\Rightarrow\\ U_2=${answer}\\ V$`;
  }
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
