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

const getIsTableProportionalQuestion: QuestionGenerator<Identifiers> = () => {
  const table = generateTable();

  const question: Question<Identifiers> = {
    answer: table.coeff ? "Oui" : "Non",
    instruction: `On considère le tableau ci-dessous. Est-ce un tableau de proportionnalité ?${table.table}`,
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
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
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
  const coeff = randint(2, 6);
  return flip
    ? {
        values: xValues.map((value) => value * randint(2, 5)),
      }
    : {
        values: xValues.map((value) => value * coeff),
        coeff,
      };
};

export const isTableProportional: Exercise<Identifiers> = {
  id: "isVTableProportional",
  label: "Reconnaître un tableau de proportionnalité",
  levels: ["5ème"],
  isSingleStep: true,
  sections: ["Proportionnalité"],
  generator: (nb: number) =>
    getDistinctQuestions(getIsTableProportionalQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCU",
  subject: "Mathématiques",
};
