import {
  Exercise,
  Question,
  QuestionGenerator,
  TableVEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {};

const getTestTableQuestion: QuestionGenerator<Identifiers> = () => {
  const question: Question<Identifiers> = {
    tableAnswer: [
      ["12", "13", "14"],
      ["15", "16", "17"],
      ["18", "19", "20"],
    ],
    instruction: `${randint(1, 1000)}`,
    keys: [],
    tableValues: {
      lineNames: ["A", "B", "C"],
      columnNames: ["D", "E", "F"],
      values: [
        ["12", "13", "14"],
        ["15", "", "17"],
        ["", "19", ""],
      ],
    },
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const isTableSVGAnswerValid: TableVEA<Identifiers> = (ans, { tableAnswer }) => {
  console.log(ans, tableAnswer);
  for (let line = 0; line < tableAnswer.length; line++) {
    for (let column = 0; column < tableAnswer[0].length; column++) {
      if (tableAnswer[line][column] !== ans[line][column]) return false;
    }
  }
  return true;
};
export const testTable: Exercise<Identifiers> = {
  id: "testTable",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getTestTableQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "Table",
  isTableSVGAnswerValid,
  subject: "Mathématiques",
};
