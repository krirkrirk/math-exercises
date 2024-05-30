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
import {
  MathLatex,
  MathLatexConstructor,
} from "#root/math/utils/functions/mathLatex";
import { randint } from "#root/math/utils/random/randint";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import {
  FunctionVariations,
  FunctionVariationsConstructor,
} from "#root/types/functionVariations";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {};

const getSignVariationFunctionQuestion: QuestionGenerator<Identifiers> = () => {
  const variations = generateVariations();

  const k = randint(
    Math.abs(variations.start.mathValue) !== Infinity
      ? variations.start.mathValue + 1
      : -1000,
    Math.abs(variations.end.mathValue) !== Infinity
      ? variations.end.mathValue
      : 1001,
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

  const start = getStartValue();
  const end = getEndValue();

  const middle = Math.floor(
    Math.abs(end.mathValue) !== Infinity ? end.mathValue / 2 : 0,
  );

  const firstZero = randint(
    Math.abs(start.mathValue) !== Infinity ? start.mathValue + 1 : -1000,
    middle,
  );
  const secondZero = randint(
    middle,
    Math.abs(end.mathValue) !== Infinity ? end.mathValue : 1001,
  );

  const functionVariations = FunctionVariationsConstructor(
    MathLatexConstructor(start.latexValue, start.mathValue),
    flip ? "+" : "-",
    MathLatexConstructor(end.latexValue, end.mathValue),
    [
      {
        changePoint: MathLatexConstructor(firstZero + "", firstZero),
        sign: coinFlip() ? "+" : "-",
      },
      {
        changePoint: MathLatexConstructor(secondZero + "", secondZero),
        sign: coinFlip() ? "+" : "-",
      },
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
      functionVariations.variations[0].changePoint.mathValue,
      functionVariations.variations[1].changePoint.mathValue,
    ].includes(k)
  )
    return "Nul";
  if (k < functionVariations.variations[0].changePoint.mathValue)
    return functionVariations.startSign;
  if (
    k > functionVariations.variations[0].changePoint.mathValue &&
    k < functionVariations.variations[1].changePoint.mathValue
  )
    return functionVariations.variations[0].sign;
  return functionVariations.variations[1].sign;
};

const getStartValue = (): MathLatex => {
  const flip = coinFlip();
  if (flip) {
    const nb = randint(-11, 10);
    return MathLatexConstructor(nb + "", nb);
  } else {
    return MathLatexConstructor(
      MinusInfinityNode.toTex(),
      MinusInfinityNode.value,
    );
  }
};

const getEndValue = (): MathLatex => {
  const filp = coinFlip();
  if (filp) {
    const nb = randint(20, 31);
    return MathLatexConstructor(nb + "", nb);
  } else {
    return MathLatexConstructor(
      PlusInfinityNode.toTex(),
      PlusInfinityNode.value,
    );
  }
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
