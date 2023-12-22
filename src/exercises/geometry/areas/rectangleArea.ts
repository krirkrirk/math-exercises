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
};
type VEAProps = {
  answer: string;
};

const getRectangleArea: QuestionGenerator<QCMProps, VEAProps> = () => {
  const length = randint(3, 13);
  const width = randint(1, length);
  const answer = length * width + "";
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer l'aire d'un rectangle de $${length}$ cm de longueur et de $${width}$ cm de largeur.`,
    answer: answer + "\\text{cm}^2",
    answerFormat: "tex",
    keys: [],
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer + "\\text{cm}^2");
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (randint(3, 13) * randint(3, 13) + "\\text{cm}^2").replace(".", ","),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<VEAProps> = (ans, { answer }) => {
  const texs = [answer + "", answer + "\\text{cm}^2"];
  return texs.includes(ans);
};

export const rectangleArea: MathExercise<QCMProps, VEAProps> = {
  id: "rectangleArea",
  connector: "=",
  label: "Calculer l'aire d'un rectangle",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Aires", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getRectangleArea, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
