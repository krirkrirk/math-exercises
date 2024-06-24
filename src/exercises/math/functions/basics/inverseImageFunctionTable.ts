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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
import { random } from "#root/utils/random";

type Identifiers = {
  xValues: number[];
  imageValues: number[];
};

const getInverseImageFunctionTableQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateExercise();
  const instruction = `Soit un tableau de valeurs représentant la fonction $f$. Déterminer ${
    exercise.isAskingImage ? `l'image de` : `le ou les antécédents de`
  } $${exercise.questionValue}$ par $f$
    ${exercise.exoTable.table}`;

  const question: Question<Identifiers> = {
    answer: `${exercise.answer}`,
    instruction,
    keys: ["x", "equal"],
    answerFormat: "tex",
    style: { tableHasNoHeader: true },
    identifiers: {
      xValues: exercise.exoTable.xValues,
      imageValues: exercise.exoTable.imageValues,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, xValues, imageValues },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(xValues, imageValues, answer).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  while (propositions.length < n) {
    let randProp = randint(+answer - 10, +answer + 11, [+answer]);
    tryToAddWrongProp(propositions, randProp + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [ans, ans.split("=")[1]].includes(answer);
};

const generateTable = (f: Polynomial) => {
  const xValues: number[] = generateXValues();
  const imageValues: number[] = xValues.map((value) => f.calculate(value));
  return {
    xValues,
    imageValues,
    table: `
  |$x$|${xValues
    .map((value) => `$${value}$`)
    .reduce((prev, curr) => prev + "|" + curr)}|
  |-|-|-|-|-|-|
  |$f(x)$|${imageValues
    .map((value) => `$${value}$`)
    .reduce((prev, curr) => prev + "|" + curr)}|
  `,
  };
};

const generateXValues = (): number[] => {
  const xValues: number[] = [];
  for (let i = 0; i < 5; i++) {
    let value;
    do {
      value = randint(-11, 11);
    } while (xValues.includes(value));
    xValues.push(value);
  }
  xValues.sort((a, b) => {
    return a - b;
  });
  return xValues;
};

const generateExercise = () => {
  const polynom = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  const exoTable = generateTable(polynom);
  const isAskingImage = coinFlip();
  const questionValue = isAskingImage
    ? random(exoTable.xValues)
    : random(exoTable.imageValues);
  const answer = isAskingImage
    ? polynom.calculate(questionValue)
    : (exoTable.xValues.find(
        (value, index) => exoTable.imageValues[index] === questionValue,
      ) as number);
  return { polynom, exoTable, isAskingImage, questionValue, answer };
};

const generatePropositions = (
  xValues: number[],
  imageValues: number[],
  answer: string,
): string[] => {
  const filteredXValues = xValues.filter((value) => value !== +answer);
  const firstProp = random(filteredXValues);
  const secondProp = random(
    filteredXValues
      .concat(imageValues)
      .filter((value) => ![firstProp, +answer].includes(value)),
  );
  const thirdProp = random(imageValues.filter((value) => value !== secondProp));
  return [firstProp + "", secondProp + "", thirdProp + ""];
};

export const inverseImageFunctionTable: Exercise<Identifiers> = {
  id: "inverseImageFunctionTable",
  label:
    "Déterminer l'image ou l'antécédent d'un nombre à partir d'un tableau de valeurs d'une fonction",
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
};
