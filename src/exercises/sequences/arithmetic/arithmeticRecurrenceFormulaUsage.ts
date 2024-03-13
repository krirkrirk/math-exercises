import {
  MathExercise,
  GeneratorOptions,
  Proposition,
  Question,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";
type Identifiers = {
  firstRank: number;
  firstValue: number;
  reason: number;
};

const getArithmeticRecurrenceFormulaUsage: QuestionGenerator<
  Identifiers
> = () => {
  const firstRank = randint(1, 20);
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);
  const askedRank = firstRank + 1;
  const answer = (firstValue + reason).toString();
  const question: Question<Identifiers> = {
    instruction: `$(u_n)$ est une suite définie par $u_{n+1} = ${reason} + u_n$ et $u_{${firstRank}} = ${firstValue}$. Calculer : $u_{${askedRank}}$`,
    startStatement: `u_{${askedRank}}`,
    answer,
    keys: ["u", "underscore", "equal"],
    answerFormat: "tex",
    identifiers: { firstRank, firstValue, reason },
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
const isAnswerValid: VEA<Identifiers> = (ans, { answer, firstRank }) => {
  return [
    answer,
    `u_${firstRank + 1}=${answer}`,
    `u_{${firstRank + 1}}=${answer}`,
  ].includes(ans);
};
export const arithmeticRecurrenceFormulaUsage: MathExercise<Identifiers> = {
  id: "arithmeticRecurrenceFormulaUsage",
  connector: "=",
  label: "Utiliser la formule de récurrence d'une suite arithmétique",
  levels: ["1reESM", "1reSpé", "1reTech", "1rePro", "TermTech", "TermPro"],
  sections: ["Suites"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getArithmeticRecurrenceFormulaUsage, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
