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
import { functionVariationsConstructor } from "#root/math/utils/functions/functionVariationsConstructor";
import { randint } from "#root/math/utils/random/randint";
import { FunctionVariations } from "#root/types/functionVariations";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {};

const getSignVariationFunctionQuestion: QuestionGenerator<Identifiers> = () => {
  const variations = generateVariations();

  const k = randint(
    typeof variations.start === "number" ? variations.start + 1 : -1000,
    typeof variations.end === "number" ? variations.end : 1001,
  );

  const correctAns = getCorrectAnswer(k, variations)
    .replace("+", "Positif")
    .replace("-", "Negatif");
  const question: Question<Identifiers> = {
    answer: correctAns,
    instruction: `On considère le tableau de variations ci-dessous. Quel est le signe de $f(${k})$ ?`,
    keys: [],
    answerFormat: "raw",
    signTable: variations,
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Positif", "raw");
  tryToAddWrongProp(propositions, "Negatif", "raw");
  tryToAddWrongProp(propositions, "Nul", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateVariations = (): FunctionVariations => {
  const flip = coinFlip();
  const start = randint(-10, 11);
  const end = randint(21, 31);

  const middle = Math.floor(end / 2);

  const firstZero = randint(start + 1, middle);
  const secondZero = randint(middle, end);

  const functionVariations = functionVariationsConstructor(
    start,
    flip ? "+" : "-",
    end,
    [
      { changePoint: firstZero, sign: coinFlip() ? "+" : "-" },
      { changePoint: secondZero, sign: coinFlip() ? "+" : "-" },
    ],
  );

  return functionVariations;
};

const getCorrectAnswer = (
  k: number,
  functionVariations: FunctionVariations,
): string => {
  if (
    [
      functionVariations.variations[0].changePoint,
      functionVariations.variations[1].changePoint,
    ].includes(k)
  )
    return "Nul";
  if (k < functionVariations.variations[0].changePoint)
    return functionVariations.startSign;
  if (
    k > functionVariations.variations[0].changePoint &&
    k < functionVariations.variations[1].changePoint
  )
    return functionVariations.variations[0].sign;
  return functionVariations.variations[1].sign;
};

export const signVariationFunction: Exercise<Identifiers> = {
  id: "signVariationFunction",
  label: "Tableau de variations",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Fonctions"],
  generator: (nb: number) =>
    getDistinctQuestions(getSignVariationFunctionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCM",
  subject: "Mathématiques",
};
