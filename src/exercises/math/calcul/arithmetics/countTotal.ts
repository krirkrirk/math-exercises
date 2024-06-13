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

const getCountTotalQuestion: QuestionGenerator<Identifiers> = () => {
  const table = getTable(3);

  const question: Question<Identifiers> = {
    tableAnswer: table.tableAnswer,
    instruction: `Remplir le tableau suivant.`,
    keys: [],
    tableValues: table.tableValues,
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getValues = () => {
  const value1 = randint(1, 10);
  const value2 = randint(1, 10);
  const total = value1 + value2;

  return [value1 + "", value2 + "", total + ""];
};

const getTable = (nbLines: number) => {
  const allValues: string[][] = [];
  const values: string[][] = [];
  for (let i = 0; i < nbLines; i++) {
    allValues.push(getValues());
  }
  for (let i = 0; i < allValues.length; i++) {
    if (i === 0) values.push(allValues[0]);
    else {
      let ingoredValue = random(allValues[i]);
      const resultColumn: string[] = [];
      allValues[i].forEach((value) => {
        if (value === ingoredValue) {
          resultColumn.push("");
          ingoredValue = "";
        } else resultColumn.push(value);
      });
      values.push(resultColumn);
    }
  }
  return {
    tableAnswer: allValues,
    tableValues: TableValuesConstructor([], [], values),
  };
};

const isTableSVGAnswerValid: TableVEA<Identifiers> = (ans, { tableAnswer }) => {
  console.log(ans, tableAnswer);
  return arrayEqual(tableAnswer, ans, (el1, el2) => {
    return arrayEqual(el1, el2);
  });
};

export const countTotal: Exercise<Identifiers> = {
  id: "countTotal",
  label: "Calcul du total de deux nombres",
  levels: ["4ème"],
  isSingleStep: true,
  sections: ["Arithmétique"],
  generator: (nb: number) => getDistinctQuestions(getCountTotalQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "Table",
  isTableSVGAnswerValid,
  subject: "Mathématiques",
};
