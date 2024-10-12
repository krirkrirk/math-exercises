import {
  Exercise,
  Proposition,
  Question,
  QuestionGenerator,
  QCMGenerator,
  addWrongProp,
  tryToAddWrongProp,
  addValidProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  firstValue: number;
  reason: number;
  firstRank: number;
};

const getGeometricRecurrenceFormulaUsage: QuestionGenerator<
  Identifiers
> = () => {
  const firstRank = randint(1, 20);
  const firstValue = randint(1, 10);
  const reason = randint(2, 10);
  const askedRank = firstRank + 1;
  const answer = (firstValue * reason).toString();
  const question: Question<Identifiers> = {
    instruction: `$(u_n)$ est une suite définie par $u_{n+1} = ${reason}\\times u_n$ et $u_{${firstRank}} = ${firstValue}$. Calculer : $u_{${askedRank}}$`,
    startStatement: `u_{${askedRank}}`,
    answer,
    keys: ["u", "underscore", "equal"],
    answerFormat: "tex",
    identifiers: { firstValue, reason, firstRank },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, firstValue, reason },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (firstValue + reason !== 4)
    tryToAddWrongProp(propositions, (firstValue + reason).toString());

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      firstValue * (reason + randint(-reason + 1, 6, [0])) + "",
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, firstRank }) => {
  return [
    answer,
    `u_{${firstRank + 1}}=${answer}`,
    `u_${firstRank + 1}=${answer}`,
  ].includes(ans);
  return ans === answer;
};

export const geometricRecurrenceFormulaUsage: Exercise<Identifiers> = {
  id: "geometricRecurrenceFormulaUsage",
  connector: "=",
  label: "Utiliser la formule de récurrence d'une suite géométrique",
  levels: ["1reESM", "1reSpé", "1reTech", "1rePro", "TermTech", "TermPro"],
  sections: ["Suites"],
  isSingleStep: false,
  qcmTimer: 60,
  freeTimer: 60,
  generator: (nb: number) =>
    getDistinctQuestions(getGeometricRecurrenceFormulaUsage, nb),
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
