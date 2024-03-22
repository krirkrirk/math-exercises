import {
  shuffleProps,
  Exercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  rank: number;
  u0: number;
  coeffs: number[];
};

const getRecurrenceFormulaUsageQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const coeffs = [randint(-5, 6), randint(-5, 6), randint(-3, 4, [0])];
  const u = new Polynomial(coeffs, "u_n");
  const u0 = randint(-2, 3, [0]);
  const rank = randint(1, 4);
  let currentValue = u0;
  for (let i = 0; i < rank; i++) {
    currentValue = u.calculate(currentValue);
  }
  const answer = currentValue + "";

  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $u$ la suite définie par $u_0 = ${u0}$ et pour tout $n\\geq 1$, $u_{n+1} = ${u
      .toTree()
      .toTex()}$. Calculer $u_${rank}$.`,
    keys: ["u", "underscore", "equal"],
    answerFormat: "tex",
    identifiers: { rank, u0, coeffs },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n: number,
  { answer, rank, u0, coeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const u = new Polynomial(coeffs, "u_n");
  tryToAddWrongProp(propositions, u.calculate(rank) + "");
  while (propositions.length < n) {
    const wrongAnswer = randint(-100, 100) + "";
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, rank }) => {
  return [answer, `u_{${rank}}=${answer}`, `u_${rank}=${answer}`].includes(ans);
};
export const recurrenceFormulaUsage: Exercise<Identifiers> = {
  id: "recurrenceFormulaUsage",
  connector: "=",
  label: "Utiliser la formule de récurrence d'une suite",
  levels: ["1reESM", "1reSpé", "1reTech"],
  isSingleStep: true,
  sections: ["Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getRecurrenceFormulaUsageQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
