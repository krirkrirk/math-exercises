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

const getSquareArea: QuestionGenerator<QCMProps, VEAProps> = () => {
  const side = randint(1, 21);
  const answer = side ** 2 + "";
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer l'aire d'un carré de $${side}$ cm de côté.`,
    answer: answer + "\\text{cm}^2",
    answerFormat: "tex",
    keys: ["cm", "cm2"],
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer + "\\text{cm}^2");
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(1, 13) ** 2 + "\\text{cm}^2");
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<VEAProps> = (ans, { answer }) => {
  const texs = [answer + "", answer + "\\text{cm}^2"];
  return texs.includes(ans);
};

export const squareArea: MathExercise<QCMProps, VEAProps> = {
  id: "squareArea",
  connector: "=",
  label: "Calculer l'aire d'un carré",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Aires", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getSquareArea, nb, 20),
  qcmTimer: 60,
  freeTimer: 60,
  maxAllowedQuestions: 20,
  getPropositions,
  isAnswerValid,
};
