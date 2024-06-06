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
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {};

const getCoeffOfProportionQuestion: QuestionGenerator<Identifiers> = () => {
  const table = generateTable();

  const question: Question<Identifiers> = {
    answer: table.coeff ? "Oui" : "Non",
    instruction: `On considere le tableau ci-dessous, est-il proportionnel ?${table.table}`,
    keys: [],
    answerFormat: "raw",
    style: { tableHasNoHeader: true },
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  tryToAddWrongProp(propositions, "On peut pas savoir", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateTable = (): { table: string; coeff?: number } => {
  const xValues: number[] = [randint(1, 11)];

  while (xValues.length < 3) {
    let lastNb = xValues[xValues.length - 1];
    let random = randint(lastNb, lastNb + 11, [...xValues]);
    xValues.push(random);
  }

  const yValues = generateYValues(xValues);

  return {
    table: ` 
  |${xValues.map((value) => `$${value}$`).join("|")}|
  |-|-|-|
  |${yValues.values.map((value) => `$${value}$`).join("|")}|
    `,
    coeff: yValues.coeff,
  };
};

const generateYValues = (
  xValues: number[],
): { values: number[]; coeff?: number } => {
  const flip = coinFlip();
  const coeff = randint(1, 5);
  return flip
    ? {
        values: xValues.map((value) => value * randint(2, 5)),
      }
    : {
        values: xValues.map((value) => value * coeff),
        coeff,
      };
};

export const coeffOfProportion: Exercise<Identifiers> = {
  id: "coeffOfProportion",
  label:
    "Reconnaître si 2 grandeurs sont proportionnelles à partir d'un tableau.",
  levels: ["5ème"],
  isSingleStep: true,
  sections: ["Proportionnalité"],
  generator: (nb: number) =>
    getDistinctQuestions(getCoeffOfProportionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCM",
  subject: "Mathématiques",
};
