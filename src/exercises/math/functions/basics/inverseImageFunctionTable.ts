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
import { random } from "#root/utils/random";

type Identifiers = {
  xValues: string[];
  imageValues: string[];
};

const getInverseImageFunctionTableQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const polynom = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  const xValue = randint(-9, 10);
  const image = polynom.calculate(xValue);
  const table = generateTable(polynom, xValue);

  const question: Question<Identifiers> = {
    answer: `${xValue}`,
    instruction: `Soit un tableau de valeurs représentant la fonction $f$. Déterminer le ou les antécédents de $${image}$ par $f$
    ${table.table}`,
    keys: ["x", "equal"],
    answerFormat: "tex",
    style: { tableHasNoHeader: true },
    identifiers: { xValues: table.xValues, imageValues: table.imageValues },
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

const generateTable = (f: Polynomial, xValue: number) => {
  const xValues: string[] = generateXValues(xValue);
  const imageValues: string[] = xValues.map(
    (value) => `$${f.calculate(+value.substring(1).split("$")[0])}$`,
  );
  return {
    xValues,
    imageValues,
    table: `
  |$x$|${xValues.reduce((prev, curr) => prev + "|" + curr)}|
  |-|-|-|-|-|-|
  |$f(x)$|${imageValues.reduce((prev, curr) => prev + "|" + curr)}|
  `,
  };
};

const generateXValues = (xValue: number): string[] => {
  const xValues: string[] = [];
  xValues.push(`$${xValue}$`);
  for (let i = 0; i < 4; i++) {
    let value;
    do {
      value = randint(-11, 11);
    } while (xValues.includes(`$${value}$` + ""));
    xValues.push(`$${value}$`);
  }
  xValues.sort((a, b) => {
    return +a.substring(1).split("$")[0] - +b.substring(1).split("$")[0];
  });
  return xValues;
};

const generatePropositions = (
  xValues: string[],
  imageValues: string[],
  answer: string,
): string[] => {
  const filteredXValues = xValues.filter((value) => value !== `$${answer}$`);
  const firstProp = random(filteredXValues);
  const secondProp = random(
    filteredXValues.concat(imageValues).filter((value) => value !== firstProp),
  );
  const thirdProp = random(imageValues.filter((value) => value !== secondProp));
  return [
    firstProp.substring(1).split("$")[0],
    secondProp.substring(1).split("$")[0],
    thirdProp.substring(1).split("$")[0],
  ];
};

export const inverseImageFunctionTable: Exercise<Identifiers> = {
  id: "inverseImageFunctionTable",
  label:
    "Déterminer le(s) antécédent(s) d'un nombre à partir d'un tableau de valeur d'une fonction",
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
