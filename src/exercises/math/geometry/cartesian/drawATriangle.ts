import {
  Exercise,
  GGBVEA,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {};

const getDrawATriangleQuestion: QuestionGenerator<Identifiers> = () => {
  const ab = randint(2, 6);
  const ac = randint(2, 6);
  const bc = randint(Math.max(ab, ac) + 1, ab + ac + 1);

  const question: Question<Identifiers> = {
    ggbAnswer: [""],
    instruction: `Dessiner le triangle $ABC$ en sachant que : $AB=${ab}$, $AC=${ac}$ et $BC=${bc}$`,
    keys: [],
    answerFormat: "tex",
    studentGgbOptions:{
      customToolBar:
    },
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  throw Error("VEA not implemented");
};
export const drawATriangle: Exercise<Identifiers> = {
  id: "drawATriangle",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getDrawATriangleQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  isGGBAnswerValid,
  subject: "Mathématiques",
};
