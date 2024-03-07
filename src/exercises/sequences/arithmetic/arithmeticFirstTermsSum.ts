import {
  MathExercise,
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
import { random } from "#root/utils/random";

type Identifiers = {
  firstRank: number;
  firstValue: number;
  reason: number;
  nbTerms: number;
};

const getArithmeticFirstTermsSumQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const firstRank = random([0, 1]);
  const firstValue = randint(-9, 10);
  const reason = randint(-5, 5, [0]);
  const nbTerms = randint(4, 9);
  const lastRank = firstRank + nbTerms - 1;
  const answer =
    (lastRank - firstRank + 1) *
      (firstRank === 0 ? firstValue : firstValue - reason) +
    (reason * (lastRank * (lastRank + 1))) / 2;
  const answerTex = answer + "";
  const question: Question<Identifiers> = {
    answer: answerTex,
    instruction: `Soit $u$ une suite arithmétique de premier terme $u_${firstRank} = ${firstValue}$ et de raison $${reason}$. Calculer la somme des $${nbTerms}$ premiers termes de $u$.`,
    keys: [],
    answerFormat: "tex",
    identifiers: { firstRank, firstValue, reason, nbTerms },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-100, 100) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const arithmeticFirstTermsSum: MathExercise<Identifiers> = {
  id: "arithmeticFirstTermsSum",
  connector: "=",
  label: "Calculer la somme des premiers termes d'une suite arithmétique",
  levels: ["1rePro", "1reESM", "1reTech", "1reSpé"],
  isSingleStep: true,
  sections: ["Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getArithmeticFirstTermsSumQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
