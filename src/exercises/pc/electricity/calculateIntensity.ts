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
import { random } from "#root/utils/random";

type Identifiers = {
  l1: number;
  l2: number;
  isAsking: string;
  circuit: string;
};

const getCalculateIntensityQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExercise();
  const schemaIllu =
    exo.circuit === "Série"
      ? " https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/activities/quizzes/generator/electricCircuit3.png"
      : "https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/activities/quizzes/generator/electricCircuit2.png";
  const question: Question<Identifiers> = {
    answer: exo.answer + "",
    instruction: exo.instruction + `![](${schemaIllu})`,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      l1: exo.l1,
      l2: exo.l2,
      isAsking: exo.isAsking,
      circuit: exo.circuit,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isAsking, circuit, l1, l2 },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(l1, l2, isAsking, circuit).forEach((value) =>
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
  const isAsking = random(["L", "L1", "L2"]);
  const circuit = random(["Série", "Parallèle"]);
  const values = [l1 + l2, l1, l2];
  const instruction = getInstruction(isAsking, l1, l2);
  const answer =
    circuit === "Série"
      ? l1
      : values[["L", "L1", "L2"].findIndex((value) => value === isAsking)];

  return {
    instruction,
    answer,
    l1,
    l2,
    isAsking,
    circuit,
  };
};

const getInstruction = (isAsking: string, l1: number, l2: number): string => {
  switch (isAsking) {
    case "L":
      return `Pour ce circuit schématisé, l'intensité du courant qui traverse la lampe $L_1$ est de $${l1}$ $mA$, celle traversant la lampe $L_2$ est de $${l2}$ $mA$. \n \\
  Calculer l'intensité du courant qui traverse la pile.`;
    case "L1":
      return `Pour ce circuit schématisé, l'intensité du courant qui traverse la lampe $L_2$ est de $${l2}$ $mA$, celle traversant la pile est de $${
        l2 + l1
      }$ $mA$. \n \\
  Calculer l'intensité du courant qui traverse la lampe $L_1$.`;
    case "L2":
      return `Pour ce circuit schématisé, l'intensité du courant qui traverse la lampe $L_1$ est de $${l1}$ $mA$, celle traversant la pile est de $${
        l2 + l1
      }$ $mA$. \n \\
    Calculer l'intensité du courant qui traverse la lampe $L_2$.`;
    default:
      return "";
  }
};

const generatePropositions = (
  l1: number,
  l2: number,
  isAsking: string,
  circuit: string,
): number[] => {
  if (circuit === "Série") return [l1 + l2, Math.abs(l1 - l2)];
  switch (isAsking) {
    case "L":
      return [l1, l2, Math.abs(l1 - l2)];
    case "L1":
      return [l2, l1 + l2, l1 + l2 + l2];
    case "L2":
      return [l1, l1 + l2, l2 + l1 + l1];
    default:
      return [];
  }
};
export const calculateIntensity: Exercise<Identifiers> = {
  id: "calculateIntensity",
  label: "Calcul d'intnsité dans un circuit électrique en série/parallèle",
  levels: ["1reSpé"],
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
