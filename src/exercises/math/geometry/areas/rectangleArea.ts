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
type Identifiers = {
  length: number;
  width: number;
};

const getRectangleArea: QuestionGenerator<Identifiers> = () => {
  const length = randint(3, 13);
  const width = randint(1, length);
  const answer = length * width + "";
  const answerTex = answer + "\\text{cm}^2";
  const question: Question<Identifiers> = {
    instruction: `Calculer l'aire d'un rectangle de $${length}$ cm de longueur et de $${width}$ cm de largeur.`,
    answer: answerTex,
    answerFormat: "tex",
    keys: [],
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
      (randint(3, 13) * randint(3, 13) + "\\text{cm}^2").replace(".", ","),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const texs = [answer, answer.split("\\text")[0]];
  return texs.includes(ans);
};

export const rectangleArea: Exercise<Identifiers> = {
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
  subject: "Mathématiques",
};
