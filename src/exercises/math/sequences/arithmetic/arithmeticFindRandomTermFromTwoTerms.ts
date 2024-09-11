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

type Identifiers = {
  rank1: number;
  value1: number;
  rank2: number;
  value2: number;
  rankAsked: number;
};

const getArithmeticFindRandomTermFromTwoTermsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const rank1 = randint(0, 10);
  const rank2 = rank1 + randint(2, 6);
  const reason = randint(-10, 10, [0]);
  const value1 = randint(-10, 10);
  const value2 = reason * (rank2 - rank1) + value1;
  const rankAsked = randint(0, 15, [rank1, rank2]);
  const value3 = reason * (rankAsked - rank1) + value1;
  const answer = value3 + "";
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $u$ une suite arithmétique telle que $u_{${rank1}} = ${value1}$ et $u_{${rank2}} = ${value2}$. Quelle est la valeur de $u_{${rankAsked}}$ ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { rank1, value1, rank2, value2, rankAsked },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-20, 20) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const arithmeticFindRandomTermFromTwoTerms: Exercise<Identifiers> = {
  id: "arithmeticFindRandomTermFromTwoTerms",
  connector: "=",
  label:
    "Déterminer un terme d'une suite arithmétique en en connaissant deux autres",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getArithmeticFindRandomTermFromTwoTermsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
