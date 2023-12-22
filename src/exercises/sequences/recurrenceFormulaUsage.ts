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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";

type QCMProps = {
  answer: string;
  rank: number;
  u0: number;
  coeffs: number[];
};
type VEAProps = {
  answer: string;
};

const getRecurrenceFormulaUsageQuestion: QuestionGenerator<
  QCMProps,
  VEAProps
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

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Soit $u$ la suite définie par $u_0 = ${u0}$ et pour tout $n\\geq 1$, $u_{n+1} = ${u
      .toTree()
      .toTex()}$. Calculer $u_${rank}$.`,
    keys: [],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, rank, u0, coeffs },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (
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
const isAnswerValid: VEA<VEAProps> = (ans, { answer }) => {
  return ans === answer;
};
export const recurrenceFormulaUsage: MathExercise<QCMProps, VEAProps> = {
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
};
