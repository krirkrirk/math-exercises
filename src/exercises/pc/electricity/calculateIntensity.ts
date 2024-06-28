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

type Identifiers = {
  l1: number;
  l2: number;
};

const getCalculateIntensityQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExercise();
  const question: Question<Identifiers> = {
    answer: exo.answer + "",
    instruction:
      exo.instruction +
      `![](https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/activities/quizzes/generator/electricCircuit2.png)`,
    keys: [],
    answerFormat: "tex",
    identifiers: { l1: exo.l1, l2: exo.l2 },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, l1, l2 }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(l1, l2).forEach((value) =>
    tryToAddWrongProp(propositions, value + ""),
  );
  while (propositions.length < n) {
    let random =
      randint(+answer - Math.min(5, +answer - 1), +answer + 6, [+answer]) + "";
    tryToAddWrongProp(propositions, random);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateExercise = () => {
  const l1 = randint(10, 60);
  const l2 = randint(10, 60);
  const instruction = `Pour ce circuit schématisé, l'intensité du courant qui traverse la lampe $L_1$ est de $${l1}$ $mA$, celle traversant la lampe $L_2$ est de $${l2}$ $mA$. \n \\
  Calculer l'intensité du courant qui traverse la pile.`;

  return {
    instruction,
    answer: l1 + l2,
    l1,
    l2,
  };
};

const generatePropositions = (l1: number, l2: number): number[] => {
  return [l1 - l2, l1, l2];
};
export const calculateIntensity: Exercise<Identifiers> = {
  id: "calculateIntensity",
  label: "Calcul d'intnsité dans un circuit électrique en parallèle",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Électricité"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateIntensityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
