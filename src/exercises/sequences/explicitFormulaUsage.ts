import {
  shuffleProps,
  MathExercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  rank: number;
  coeffs: number[];
};
const getExplicitFormulaUsageQuestion: QuestionGenerator<Identifiers> = () => {
  const u = PolynomialConstructor.randomWithOrder(2, "n");
  const rank = randint(0, 4);
  const answer = u.calculate(rank) + "";

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Soit $u$ la suite définie pour tout $n\\geq 0$ par $u_n = ${u
      .toTree()
      .toTex()}$. Calculer $u_${rank}$.`,
    keys: ["u", "underscore", "equal"],
    answerFormat: "tex",
    identifiers: { rank, coeffs: u.coefficients },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, rank, coeffs },
) => {
  const propositions: Proposition[] = [];
  const u = new Polynomial(coeffs);
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, u.calculate(rank - 1) + "");
  tryToAddWrongProp(propositions, u.calculate(rank + 1) + "");
  while (propositions.length < n) {
    const wrongAnswer = randint(-100, 100) + "";
    tryToAddWrongProp(propositions, wrongAnswer);
  }
  return shuffleProps(propositions, n);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, rank }) => {
  return [answer, `u_{${rank}}=${answer}`, `u_${rank}=${answer}`].includes(ans);
};
export const explicitFormulaUsage: MathExercise<Identifiers> = {
  id: "explicitFormulaUsage",
  connector: "=",
  label: "Utiliser la formule explicite d'une suite",
  levels: ["1reESM", "1reSpé", "1reTech"],
  isSingleStep: true,
  sections: ["Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getExplicitFormulaUsageQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
