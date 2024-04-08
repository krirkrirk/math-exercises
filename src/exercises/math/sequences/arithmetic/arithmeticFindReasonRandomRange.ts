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
import { v4 } from "uuid";
type Identifiers = {
  rank1: number;
  rank2: number;
  reason: number;
  value1: number;
};

const getArithmeticFindReasonRandomRange: QuestionGenerator<
  Identifiers
> = () => {
  const rank1 = randint(0, 10);
  const rank2 = rank1 + randint(2, 6);
  const reason = randint(-10, 10, [0]);
  const value1 = randint(-10, 10);
  const value2 = reason * (rank2 - rank1) + value1;
  const answer = reason + "";
  const question: Question<Identifiers> = {
    instruction: `$(u_n)$ est une suite arithmétique. On sait que $u_{${rank1}} = ${value1}$ et $u_{${rank2}} = ${value2}$. Quelle est la raison de la suite $(u_n)$ ?`,
    startStatement: "r",
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { rank1, reason, value1, rank2 },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, Number(answer) + randint(-5, 6, [0]) + "");
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const arithmeticFindReasonRandomRange: Exercise<Identifiers> = {
  id: "arithmeticFindReasonRandomRange",
  connector: "=",
  label: "Déterminer la raison d'une suite arithmétique (écart aléatoire)",
  levels: ["1reESM", "1reSpé", "1reTech", "1rePro", "TermTech", "TermPro"],
  sections: ["Suites"],
  isSingleStep: false,
  getPropositions,
  isAnswerValid,
  qcmTimer: 60,
  freeTimer: 60,
  generator: (nb: number) =>
    getDistinctQuestions(getArithmeticFindReasonRandomRange, nb),
  subject: "Mathématiques",
};
