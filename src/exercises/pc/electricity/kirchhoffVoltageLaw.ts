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
import { random } from "#root/utils/alea/random";

type Identifiers = {
  isAsking: string;
  uAB: number;
  uED: number;
  uDC: number;
};

const getKirchhoffVoltageLawQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExercise();
  const question: Question<Identifiers> = {
    answer: exo.answer + "",
    instruction:
      exo.instruction +
      `![](https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/activities/quizzes/generator/electricCircuit1.png)`,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      isAsking: exo.isAsking,
      uAB: exo.uAB,
      uED: exo.uED,
      uDC: exo.uDC,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isAsking, uAB, uDC, uED },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generateProposition(isAsking, uAB, uED, uDC).forEach((value) =>
    tryToAddWrongProp(propositions, value + ""),
  );
  while (propositions.length < n) {
    let random = randint(+answer - Math.min(5, +answer), +answer + 6, [
      +answer,
    ]);
    tryToAddWrongProp(propositions, random + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateProposition = (
  isAsking: string,
  uAB: number,
  uED: number,
  uDC: number,
) => {
  switch (isAsking) {
    case "UAB":
      return [uDC + uED, Math.abs(uDC - uED)];
    case "UED":
      return [uAB + uDC, uAB, uDC];
    case "UDC":
      return [uAB + uED, uAB, uED];
  }
  return [uAB - uED, uAB - uDC, uED + uDC];
};

const generateExercise = () => {
  const uED = randint(1, 60);
  const uDC = randint(1, 60);
  const uAB = uED + uDC;
  const isAsking = random(["UAB", "UDC", "UED"]);
  const instruction = getInstruction(isAsking, uAB, uDC, uED);
  const answer = getAnswer(isAsking, uAB, uDC, uED);

  return {
    instruction,
    answer,
    isAsking,
    uAB,
    uED,
    uDC,
  };
};

const getInstruction = (
  isAsking: string,
  uAB: number,
  uDC: number,
  uED: number,
) => {
  switch (isAsking) {
    case "UAB":
      return `Un circuit est alimenté par une pile. \n \\
      La tension $U_{DC}$ aux bornes de la diode est $${uDC}$ $V$. \n \\
      La tension $U_{ED}$ aux bornes du conducteur ohmique est $${uED}$ $V$. \n \\
      Cacluler la tension de la pile $U_{AB}$.`;
    case "UED":
      return `Un circuit est alimenté par une pile de $${uAB}$ $V$. \n \\
      La tension $U_{DC}$ aux bornes de la diode est $${uDC}$ $V$. \n \\
      Calculer la tension $U_{ED}$ aux bornes du conducteur ohmique.`;
    case "UDC":
      return `Un circuit est alimenté par une pile de $${uAB}$ $V$. \n \\
      La tension $U_{ED}$ aux bornes du conducteur ohmique est $${uED}$ $V$. \n \\
      Calculer la tension $U_{DC}$ aux bornes de la diode.`;
    default:
      return "";
  }
};

const getAnswer = (isAsking: string, uAB: number, uDC: number, uED: number) => {
  switch (isAsking) {
    case "UAB":
      return uDC + uED;
    case "UED":
      return uAB - uDC;
    case "UDC":
      return uAB - uED;
    default:
      return 0;
  }
};
export const kirchhoffVoltageLaw: Exercise<Identifiers> = {
  id: "kirchhoffVoltageLaw",
  label: "Application de la loi de maille",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Électricité"],
  generator: (nb: number) =>
    getDistinctQuestions(getKirchhoffVoltageLawQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
