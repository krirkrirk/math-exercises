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
  side: number;
};

const getSquareArea: QuestionGenerator<Identifiers> = () => {
  const side = randint(1, 21);
  const answer = side ** 2 + "";
  const answerTex = answer + "\\text{cm}^2";
  const question: Question<Identifiers> = {
    instruction: `Calculer l'aire d'un carré de $${side}$ cm de côté.`,
    answer: answerTex,
    answerFormat: "tex",
    keys: ["cm", "cm2"],
    identifiers: { side },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(1, 13) ** 2 + "\\text{cm}^2");
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const texs = [answer, answer.split("\\text")[0]];
  return texs.includes(ans);
};

export const squareArea: MathExercise<Identifiers> = {
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
