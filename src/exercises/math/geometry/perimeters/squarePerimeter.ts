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
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  side: number;
};

const getSquarePerimeter: QuestionGenerator<Identifiers> = () => {
  const side = randint(1, 21);
  const answer = side * 4 + "";
  const answerTex = answer + "\\text{cm}";
  const question: Question<Identifiers> = {
    instruction: `Calculer le périmètre d'un carré de $${side}$ cm de côté.`,
    answer: answerTex,
    answerFormat: "tex",
    keys: ["cm", "cm2"],
    identifiers: { side },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, side }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      side * 4 + randint(-side * 4 + 1, 14, [0]) + "\\text{cm}",
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const texs = [answer, answer.split("\\text")[0]];
  return texs.includes(ans);
};
export const squarePerimeter: Exercise<Identifiers> = {
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
  subject: "Mathématiques",
};
