import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
import { probaFlip } from "#root/utils/probaFlip";

type Identifiers = {
  a: number;
  b: number;
};

const getIntegerOrderingQuestion: QuestionGenerator<Identifiers> = () => {
  let a: number;
  let b: number;
  if (probaFlip(0.66)) {
    a = randint(-20, 0);
    b = randint(-20, 0, [a]);
  } else {
    if (coinFlip()) {
      a = randint(-20, 0);
      b = randint(0, 20, [a]);
    } else {
      a = randint(0, 20);
      b = randint(0, 20, [a]);
    }
  }
  const answer = a < b ? "<" : ">";
  const question: Question<Identifiers> = {
    answer,
    instruction: `Compléter par le bon symbole : $${a}\\ ...... \\ ${b}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, "<");
  tryToAddWrongProp(propositions, ">");
  tryToAddWrongProp(propositions, "=");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const integerOrdering: Exercise<Identifiers> = {
  id: "integerOrdering",
  connector: "\\iff",
  label: "Comparer des nombres entiers relatifs",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getIntegerOrderingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCU",
  subject: "Mathématiques",
};
