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
};

const getInverseImageFunctionTableQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const polynom = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  const a = polynom.coefficients[1];
  const b = polynom.coefficients[2];
  const xValue = randint(-9, 10);
  const image = polynom.calculate(xValue);
  const table = generateTable(polynom, xValue);

  const question: Question<Identifiers> = {
    answer: `$${xValue}$`,
    instruction: `Soit un tableau de valeurs représentant la fonction $f$. Déterminer le ou les antécédents de $${image}$ par $f$
    ${table.table}`,
    keys: ["x", "equal"],
    answerFormat: "tex",
    style: { tableHasNoHeader: true },
    identifiers: { xValues: table.xValues },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, xValues }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    let randProp = random(xValues);
    if (randProp !== answer) tryToAddWrongProp(propositions, randProp);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [answer, answer.split("=")[1]].includes(ans);
};

const generateTable = (f: Polynomial, xValue: number) => {
  const xValues: string[] = [];
  const randQuestionValue = randint(0, 4);
  for (let i = 0; i < 5; i++) {
    let value;
    if (randQuestionValue === i) {
      xValues.push(`$${xValue}$`);
    } else {
      do {
        value = randint(-9, 10);
      } while (xValues.includes(value + ""));
      xValues.push(`$${value}$`);
    }
  }
  const imageValues: string[] = xValues.map(
    (value) => `$${f.calculate(+value.substring(1).split("$")[0])}$`,
  );
  return {
    xValues,
    imageValues,
    table: `
  | | | | | |
  |-|-|-|-|-|
  |$x$|${xValues.reduce((prev, curr) => prev + "|" + curr)}|
  |$f$|${imageValues.reduce((prev, curr) => prev + "|" + curr)}|
  `,
  };
};
export const inverseImageFunctionTable: Exercise<Identifiers> = {
  id: "inverseImageFunctionTable",
  label:
    "Calculer des antécédents à partir d'un tableau de valeur d'une fonction",
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
