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

const getExplicitFormulaUsageQuestion: QuestionGenerator<
  QCMProps,
  VEAProps
> = () => {
  const u = PolynomialConstructor.randomWithOrder(2, "n");
  const rank = randint(0, 4);
  const answer = u.calculate(rank) + "";

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Soit $u$ la suite définie pour tout $n\\geq 0$ par $u_n = ${u
      .toTree()
      .toTex()}$. Calculer $u_${rank}$.`,
    keys: [],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, rank, coeffs: u.coefficients },
  };
  return question;
};

type QCMProps = {
  answer: string;
  rank: number;
  coeffs: number[];
};
type VEAProps = {
  answer: string;
};

const getPropositions: QCMGenerator<QCMProps> = (
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
const isAnswerValid: VEA<VEAProps> = (ans, { answer }) => {
  return ans === answer;
};
export const explicitFormulaUsage: MathExercise<QCMProps, VEAProps> = {
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
