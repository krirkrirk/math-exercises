import {
  Exercise,
  GetInstruction,
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
import { IntegerConstructor } from "#root/math/numbers/integer/integer";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randTupleInt } from "#root/math/utils/random/randTupleInt";
import { randint } from "#root/math/utils/random/randint";
import { arrayHasSameElements } from "#root/utils/arrays/arrayHasSameElement";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";
import { mdTable } from "#root/utils/markdown/mdTable";
import { dollarize } from "#root/utils/latex/dollarize";

type Identifiers = {
  xValues: number[];
  imageValues: number[];
  isAskingImage: boolean;
  value: number;
};

const getInstruction: GetInstruction<Identifiers> = ({
  imageValues,
  isAskingImage,
  value,
  xValues,
}) => {
  return `Ci-dessous est donné le tableau de valeurs d'une fonction $f$. Déterminer ${
    isAskingImage ? `l'image de` : `le ou les antécédents de`
  } $${value}$ par $f$.

${mdTable([
  ["$x$", ...xValues.map((n) => dollarize(n.frenchify()))],
  ["$f(x)$", ...imageValues.map((n) => dollarize(n.frenchify()))],
])}
`;
};
const getInverseImageFunctionTableQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const xValues = randTupleInt(5, {
    from: -10,
    to: 10,
    allDifferent: true,
  }).sort((a, b) => a - b);
  const yValues = randTupleInt(5, { from: -10, to: 10 });
  let indexAsked = randint(0, 5);
  const valueAsked = xValues[indexAsked];
  //on force un meme nombre dans les deux lignes pour complexifier
  if (!yValues.includes(valueAsked) || yValues[indexAsked] === valueAsked) {
    yValues[randint(0, 5, [indexAsked])] = valueAsked;
  }
  const isAskingImage = coinFlip();
  const answer =
    (isAskingImage
      ? yValues[indexAsked]
      : xValues
          .filter((el, index) => yValues[index] === valueAsked)
          .join("\\text{ et }")) + "";

  const identifiers = {
    xValues,
    imageValues: yValues,
    isAskingImage,
    value: valueAsked,
  };
  const question: Question<Identifiers> = {
    answer,
    instruction: getInstruction(identifiers),
    keys: ["et"],
    answerFormat: "tex",
    style: { tableHasNoHeader: true },
    identifiers: {
      xValues,
      imageValues: yValues,
      isAskingImage,
      value: valueAsked,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, xValues, imageValues, isAskingImage, value },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  if (isAskingImage) {
    tryToAddWrongProp(propositions, xValues[imageValues.indexOf(value)] + "");
  } else {
    tryToAddWrongProp(propositions, imageValues[xValues.indexOf(value)] + "");
  }
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (coinFlip() ? random(xValues) : random(imageValues)) + "",
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, xValues, imageValues, isAskingImage, value },
) => {
  const numbers = ans.split("\\text{ et }").map((el) => Number(el));
  if (numbers.some((n) => isNaN(n))) return false;
  const answerNumbers = answer.split("\\text{ et }").map((el) => Number(el));
  return ans === answer || arrayHasSameElements(numbers, answerNumbers);
};

export const inverseImageFunctionTable: Exercise<Identifiers> = {
  id: "inverseImageFunctionTable",
  label:
    "Déterminer une image ou un antécédent à partir d'un tableau de valeurs",
  levels: ["3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  isSingleStep: true,
  sections: ["Fonctions"],
  generator: (nb: number) =>
    getDistinctQuestions(getInverseImageFunctionTableQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getInstruction,
};
