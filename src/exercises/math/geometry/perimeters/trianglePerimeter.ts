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
  sides: number[];
};

const getTrianglePerimeter: QuestionGenerator<Identifiers> = () => {
  const sides = [randint(1, 13), randint(1, 13), randint(1, 13)];
  const answer = sides[0] + sides[1] + sides[2] + "";
  const answerTex = answer + "\\text{cm}";
  const question: Question<Identifiers> = {
    instruction: `Calculer le périmètre d'un triangle dont les côtés mesurent : $${sides[0]}$ cm, $${sides[1]}$ cm et $${sides[2]}$ cm.`,
    answer: answerTex,
    answerFormat: "tex",
    keys: ["cm", "cm2"],
    identifiers: { sides },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const perimeter = Number(answer.split("\\text")[0]);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      perimeter + randint(-perimeter + 1, 14, [0]) + "\\text{cm}",
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const texs = [answer, answer.split("\\text")[0]];
  return texs.includes(ans);
};
export const trianglePerimeter: Exercise<Identifiers> = {
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
  subject: "Mathématiques",
};
