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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  firstValue: number;
  askedRank: number;
  reason: number;
};

const getArithmeticExplicitFormulaUsage: QuestionGenerator<
  Identifiers
> = () => {
  const askedRank = randint(0, 10);
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);

  const polynomial = new Polynomial([firstValue, reason], "n");
  const answer = (firstValue + askedRank * reason).toString();

  const question: Question<Identifiers> = {
    instruction: `$(u_n)$ est une suite arithmétique définie par $u_n = ${polynomial
      .toTree()
      .toTex()}$. Calculer : $u_{${askedRank}}$`,
    startStatement: `u_{${askedRank}}`,
    answer,
    keys: ["u", "underscore", "equal"],
    answerFormat: "tex",
    identifiers: { firstValue, askedRank, reason },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n: number,
  { answer, firstValue, askedRank, reason },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (randint(-5, 6, [firstValue]) + askedRank * reason).toString(),
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, askedRank }) => {
  return [
    answer,
    `u_${askedRank}=${answer}`,
    `u_{${askedRank}}=${answer}`,
  ].includes(ans);
};
export const arithmeticExplicitFormulaUsage: Exercise<Identifiers> = {
  id: "arithmeticExplicitFormulaUsage",
  connector: "=",
  label: "Utiliser la formule générale d'une suite arithmétique",
  levels: ["1reESM", "1reSpé", "1reTech", "1rePro", "TermTech", "TermPro"],
  sections: ["Suites"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getArithmeticExplicitFormulaUsage, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
