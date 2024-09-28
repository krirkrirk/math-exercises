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
  randomSide: number;
};

const sides = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [12, 35, 37],
  [9, 40, 41],
  [28, 45, 53],
  [11, 60, 61],
  [16, 63, 65],
  [33, 56, 65],
  [48, 55, 73],
  [13, 84, 85],
  [36, 77, 85],
  [39, 80, 89],
  [65, 72, 97],
];

const getTriangleAreaV2: QuestionGenerator<Identifiers> = () => {
  const randomSide = randint(0, sides.length);
  const area = (sides[randomSide][0] * sides[randomSide][1]) / 2;
  const answer = area + "";
  const answerTex = answer + "\\text{cm}^2";
  const question: Question<Identifiers> = {
    instruction: `Calculer l'aire du triangle rectangle dont les côtés mesurent : $${sides[randomSide][0]}$ cm, $${sides[randomSide][1]}$ cm et $${sides[randomSide][2]}$ cm.`,
    answer: answerTex,
    answerFormat: "tex",
    keys: ["cm", "cm2"],
    identifiers: { randomSide },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, randomSide },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const area = Number(answer.split("\\text")[0]);
  tryToAddWrongProp(
    propositions,
    sides[randomSide][0] +
      sides[randomSide][1] +
      sides[randomSide][2] +
      "\\text{cm}^2",
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      area + randint(-area + 1, 14, [0]) + "\\text{cm}^2",
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const texs = [answer, answer.split("\\text")[0]];
  return texs.includes(ans);
};
export const triangleAreaV2: Exercise<Identifiers> = {
  id: "triangleAreaV2",
  connector: "=",
  label: "Calculer l'aire d'un triangle (sans figure)",
  levels: ["5ème", "4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Aires", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getTriangleAreaV2, nb, 16),
  qcmTimer: 60,
  freeTimer: 60,
  maxAllowedQuestions: 16,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
