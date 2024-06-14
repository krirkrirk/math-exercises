import {
  Exercise,
  Question,
  QuestionGenerator,
  TableVEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { TableValuesConstructor } from "#root/types/tableValues";
import { arrayEqual } from "#root/utils/arrayEqual";
import { random } from "#root/utils/random";

type Identifiers = {};

const getFillProportionalTableQuestion: QuestionGenerator<Identifiers> = () => {
  const exercise = generateExericse();

  const question: Question<Identifiers> = {
    tableAnswer: exercise.tableAnswer,
    instruction: `Complétez le tableau de proportions ci-dessous avec les valeurs manquantes`,
    keys: [],
    tableValues: exercise.tableValues,
    identifiers: {},
  };

  return question;
};

const isTableSVGAnswerValid: TableVEA<Identifiers> = (ans, { tableAnswer }) => {
  console.log(ans, tableAnswer);
  return arrayEqual(ans, tableAnswer, (arr1, arr2) => {
    return arrayEqual(arr1, arr2);
  });
};

const generateExericse = () => {
  const exerciseTable: string[][] = [];
  const table: string[][] = generateTable();
  let ignoredValue: string;
  for (let line = 0; line < table.length; line++) {
    ignoredValue = random(table[line]);
    exerciseTable.push([]);
    for (let column = 0; column < table[0].length; column++) {
      if (table[line][column] === ignoredValue) {
        exerciseTable[line][column] = "";
        ignoredValue = "";
      } else exerciseTable[line][column] = table[line][column];
    }
  }
  return {
    tableAnswer: table,
    tableValues: TableValuesConstructor([], [], exerciseTable),
  };
};

const generateTable = (): string[][] => {
  const coeff = randint(1, 10);
  const firstLine: string[] = [];
  const secondLine: string[] = [];
  for (let line = 0; line < 3; line++) {
    const value = randint(1, 10);
    firstLine.push(value + "");
    secondLine.push(value * coeff + "");
  }
  return [firstLine, secondLine];
};

export const fillProportionalTable: Exercise<Identifiers> = {
  id: "fillProportionalTable",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getFillProportionalTableQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isTableSVGAnswerValid,
  subject: "Mathématiques",
};
