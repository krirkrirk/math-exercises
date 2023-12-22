import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";

type QCMProps = {
  answer: string;
};
type VEAProps = {
  answer: string;
};

const getTrianglePerimeter: QuestionGenerator<QCMProps, VEAProps> = () => {
  const sides = [randint(1, 13), randint(1, 13), randint(1, 13)];
  const answer = sides[0] + sides[1] + sides[2] + "";

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer le périmètre d'un triangle dont les côtés mesurent : $${sides[0]}$ cm, $${sides[1]}$ cm et $${sides[2]}$ cm.`,
    answer: answer + "\\text{cm}",
    answerFormat: "tex",
    keys: ["cm", "cm2"],
    qcmGeneratorProps: { answer },
  };

  return question;
};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer + "\\text{cm}");
  const perimeter = Number(answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      perimeter + randint(-perimeter + 1, 14, [0]) + "\\text{cm}",
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<VEAProps> = (ans, { answer }) => {
  const texs = [answer + "", answer + "\\text{cm}"];
  return texs.includes(ans);
};
export const trianglePerimeter: MathExercise<QCMProps, VEAProps> = {
  id: "trianglePerimeter",
  connector: "=",
  label: "Calculer le périmètre d'un triangle",
  levels: ["5ème", "4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Périmètres", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getTrianglePerimeter, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
