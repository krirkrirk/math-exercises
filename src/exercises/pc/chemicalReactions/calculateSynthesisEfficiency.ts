import { frenchify } from "./../../../math/utils/latex/frenchify";
import {
  Exercise,
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
import { randfloat } from "#root/math/utils/random/randfloat";
import { round, roundSignificant } from "#root/math/utils/round";

type Identifiers = {
  maxQuantity: number;
  productQuantity: number;
};

const getCalculateSynthesisEfficiencyQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const maxQuantity = randfloat(0.2, 0.6, 2);
  const productQuantity = randfloat(maxQuantity / 2, maxQuantity * 0.9, 2);

  const efficiency = round(productQuantity / maxQuantity, 2);

  const question: Question<Identifiers> = {
    answer: `${roundSignificant(efficiency, 2)}`,
    instruction: `Lors d'une synthèse chimique, ${roundSignificant(
      maxQuantity,
      2,
    )} mol de produit est attendu au maximum, et il se forme au final ${roundSignificant(
      productQuantity,
      2,
    )} mol de produit.
    Calculer le rendement.
    `,
    keys: [],
    answerFormat: "tex",
    identifiers: { maxQuantity, productQuantity },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, maxQuantity, productQuantity },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const wrongDivision = maxQuantity / productQuantity;
  const multiplied = maxQuantity * productQuantity;
  const substracted = maxQuantity - productQuantity;

  tryToAddWrongProp(propositions, `${roundSignificant(wrongDivision, 2)}`);
  tryToAddWrongProp(propositions, `${roundSignificant(multiplied, 2)}`);
  tryToAddWrongProp(propositions, `${roundSignificant(substracted, 2)}`);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, `${roundSignificant(randfloat(0, 5), 2)}`);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const calculateSynthesisEfficiency: Exercise<Identifiers> = {
  id: "calculateSynthesisEfficiency",
  label: "Calculer un rendement",
  levels: ["1reESM"],
  isSingleStep: true,
  sections: ["Chimie des solutions"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateSynthesisEfficiencyQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
