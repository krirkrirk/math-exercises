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

type Identifiers = {
  uED: number;
  iEC: number;
};

const getCalculateResistanceQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExercise();
  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: exo.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { uED: exo.uED, iEC: exo.iEC },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, uED, iEC },
) => {
  const propositions: Proposition[] = [];
  const resistance = +(uED / (iEC * Math.pow(10, -3))).toFixed(0);
  addValidProp(propositions, answer);
  generatePropositions(uED, iEC).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  while (propositions.length < n) {
    let random = randint(resistance - 20, resistance + 21, [resistance]) + "";
    tryToAddWrongProp(propositions, random);
  }
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
  const uAB = randint(5, 9);
  const uDC = randfloat(1.8, 3.3, 1);
  const uED = +(uAB - uDC).toFixed(1);
  const iEC = randint(10, 30);
  const instruction = `Un circuit est alimenté par une pile de $${uAB}\\ V$. La tension $U_{DC}$ aux bornes de la $DEL$ est de $${uDC.frenchify()}\\ V$. 
  
  L'intensité du courant qui circule de E vers C dans la branche comportant la DEL est de ${iEC} mA.

  La tension $U_{ED}$ aux bornes du conducteur ohmique est de $${uED.frenchify()}\\ V$
  
  Calculer la résistance $R$ du conducteur ohmique en $\\Omega$, arrondie à l'unité.`;

  const answer = +(uED / (iEC * Math.pow(10, -3))).toFixed(0);

  return {
    instruction,
    answer: answer + "",
    uAB,
    uDC,
    uED,
    iEC,
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
