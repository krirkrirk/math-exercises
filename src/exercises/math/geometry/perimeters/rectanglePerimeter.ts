import {
  Exercise,
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
import { shuffle } from "#root/utils/alea/shuffle";
import { v4 } from "uuid";
type Identifiers = {
  length: number;
  width: number;
};
const getRectanglePerimeter: QuestionGenerator<Identifiers> = () => {
  const length = randint(3, 13);
  const width = randint(1, length);
  const answer = (length + width) * 2 + "";
  const answerTex = answer + "\\text{cm}";
  const question: Question<Identifiers> = {
    instruction: `Calculer le périmètre d'un rectangle de $${length}$ cm de longueur et de $${width}$ cm de largeur.`,
    answer: answerTex,
    answerFormat: "tex",
    keys: ["cm", "cm2"],
    identifiers: { length, width },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (randint(3, 13) + randint(1, 13)) * 2 + "\\text{cm}",
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const texs = [answer, answer.split("\\text")[0]];
  return texs.includes(ans);
};

export const rectanglePerimeter: Exercise<Identifiers> = {
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
  subject: "Mathématiques",
};
