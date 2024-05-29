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
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  xValues: number[];
  fValues: number[];
  questionType: string;
  valuesnumber: number;
};

const getFunctionMinMaxQuestion: QuestionGenerator<Identifiers> = () => {
  const valuesnumber = randint(2, 6);
  const minormax = coinFlip();
  const questionType = minormax ? `maximum` : `minimum`;

  const xValues = [];
  let firstxvalue = randint(-10, 10);
  for (let i = 0; i < valuesnumber; i++) {
    xValues.push(firstxvalue);
    firstxvalue += randint(1, 5);
  }

  const fValues = [];
  let firstfvalue = randint(-10, 10);
  let isIncreasing = true;

  for (let i = 0; i < valuesnumber; i++) {
    fValues.push(firstfvalue);
    if (isIncreasing) {
      firstfvalue += randint(1, 5);
    } else {
      firstfvalue -= randint(1, 5);
    }
    isIncreasing = !isIncreasing;
  }

  let startIndex = randint(0, valuesnumber - 2);
  let endIndex = randint(startIndex + 1, valuesnumber - 1);

  const closureTypes = [
    ClosureType.OO,
    ClosureType.OF,
    ClosureType.FO,
    ClosureType.FF,
  ];

  const closureTypes2 = [ClosureType.OF, ClosureType.FO, ClosureType.FF];

  const closureType =
    endIndex - startIndex === 1
      ? ClosureType.FF
      : closureTypes[randint(0, closureTypes.length - 1)];

  const interval = new IntervalNode(
    xValues[startIndex].toTree(),
    xValues[endIndex].toTree(),
    closureType,
  ).toTex();

  const selectedValues = fValues.slice(startIndex, endIndex + 1);
  const filteredValues = selectedValues.filter((_, idx) => {
    if (closureType === ClosureType.OO) {
      return idx !== 0 && idx !== selectedValues.length - 1;
    } else if (closureType === ClosureType.OF) {
      return idx !== 0;
    } else if (closureType === ClosureType.FO) {
      return idx !== selectedValues.length - 1;
    } else {
      return true;
    }
  });

  const answer =
    questionType === `maximum`
      ? Math.max(...filteredValues)
      : Math.min(...filteredValues);

  const question: Question<Identifiers> = {
    answer: answer.toString(),
    instruction: `Quel est le ${questionType} de $f$ sur $${interval}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { xValues, fValues, questionType, valuesnumber },
    variationTable: { xValues: xValues, fValues: fValues },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, xValues, fValues, questionType, valuesnumber },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const wrongAnswer1 =
    questionType === "maximum"
      ? Math.max(...xValues)
          .toTree()
          .toTex()
      : Math.min(...xValues)
          .toTree()
          .toTex();
  tryToAddWrongProp(propositions, wrongAnswer1);

  for (let i = 0; i < valuesnumber; i++) {
    const wrongAnswer = fValues[i].toTree().toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 10).toTree().toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const functionMinMax: Exercise<Identifiers> = {
  id: "functionMinMax",
  label: "Maximum/Minimum d'une fonction sur un intervalle",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Fonctions"],
  generator: (nb: number) =>
    getDistinctQuestions(getFunctionMinMaxQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
