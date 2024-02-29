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
  reason: number;
  startRank: number;
  startValue: number;
};

const getArithmeticReasonUsage: QuestionGenerator<Identifiers> = () => {
  const reason = randint(-10, 10, [0]);
  const startRank = randint(0, 20);
  const askedRank = startRank + 1;
  const startValue = randint(-10, 10);
  const answer = (startValue + reason).toString();
  const question: Question<Identifiers> = {
    instruction: `$(u_n)$ est une suite arithmétique de raison $r = ${reason}$ et on sait que $u_{${startRank}} = ${startValue}$. Calculer : $u_{${askedRank}}$`,
    startStatement: `u_{${askedRank}}`,
    answer,
    keys: ["r", "n", "u", "underscore"],
    answerFormat: "tex",
    identifiers: { reason, startRank, startValue },
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
export const arithmeticReasonUsage: MathExercise<Identifiers> = {
  id: "arithmeticReasonUsage",
  connector: "=",
  label: "Utiliser la raison d'une suite arithmétique",
  levels: ["1reESM", "1reSpé", "1reTech", "1rePro", "TermTech", "TermPro"],
  sections: ["Suites"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getArithmeticReasonUsage, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
