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

type QCMProps = {
  answer: string;
  side: number;
};
type VEAProps = {
  answer: string;
};

const getSquarePerimeter: QuestionGenerator<QCMProps, VEAProps> = () => {
  const side = randint(1, 21);
  const answer = side * 4 + "";
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer le périmètre d'un carré de $${side}$ cm de côté.`,
    answer: answer + "\\text{cm}",
    answerFormat: "tex",
    keys: ["cm", "cm2"],
    qcmGeneratorProps: { answer, side },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, side }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer + "\\text{cm}");
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      side * 4 + randint(-side * 4 + 1, 14, [0]) + "\\text{cm}",
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<VEAProps> = (ans, { answer }) => {
  const texs = [answer + "", answer + "\\text{cm}"];
  return texs.includes(ans);
};
export const squarePerimeter: MathExercise<QCMProps, VEAProps> = {
  id: "squarePerimeter",
  connector: "=",
  label: "Calculer le périmètre d'un carré",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getSquarePerimeter, nb, 20),
  qcmTimer: 60,
  freeTimer: 60,
  maxAllowedQuestions: 20,
  getPropositions,
  isAnswerValid,
};
