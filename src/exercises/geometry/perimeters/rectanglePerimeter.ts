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
type Identifiers = {
  answer: string;
};
type VEAProps = {
  answer: string;
};

const getRectanglePerimeter: QuestionGenerator<Identifiers> = () => {
  const length = randint(3, 13);
  const width = randint(1, length);
  const answer = (length + width) * 2 + "";
  const question: Question<Identifiers> = {
    instruction: `Calculer le périmètre d'un rectangle de $${length}$ cm de longueur et de $${width}$ cm de largeur.`,
    answer: answer + "\\text{cm}",
    answerFormat: "tex",
    keys: ["cm", "cm2"],
    identifiers: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer + "\\text{cm}");
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (randint(3, 13) + randint(1, 13)) * 2 + "\\text{cm}",
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const texs = [answer + "", answer + "\\text{cm}"];
  return texs.includes(ans);
};

export const rectanglePerimeter: MathExercise<Identifiers> = {
  id: "rectanglePerimeter",
  connector: "=",
  label: "Calculer le périmètre d'un rectangle",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Périmètres", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getRectanglePerimeter, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
