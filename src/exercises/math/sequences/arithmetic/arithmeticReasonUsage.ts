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
import { shuffle } from "#root/utils/alea/shuffle";
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
    keys: ["u", "underscore", "equal"],
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
const isAnswerValid: VEA<Identifiers> = (ans, { answer, startRank }) => {
  return [
    answer,
    `u_${startRank + 1}=${answer}`,
    `u_{${startRank + 1}}=${answer}`,
  ].includes(ans);
};
export const arithmeticReasonUsage: Exercise<Identifiers> = {
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
  subject: "Mathématiques",
};
