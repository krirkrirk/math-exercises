import {
  shuffleProps,
  Exercise,
  Proposition,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
  QCMGenerator,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Point } from "#root/math/geometry/point";
import { Rational } from "#root/math/numbers/rationals/rational";
import { frenchify } from "#root/math/utils/latex/frenchify";
import {
  distinctRandTupleInt,
  randTupleInt,
} from "#root/math/utils/random/randTupleInt";
import { randint } from "#root/math/utils/random/randint";
import { PointNode } from "#root/tree/nodes/geometry/pointNode";
import { average } from "#root/utils/average";
import { v4 } from "uuid";

type Identifiers = {
  xValues: number[];
  yValues: number[];
};

const getAveragePointQuestion: QuestionGenerator<Identifiers> = () => {
  const points = distinctRandTupleInt(4, 2, { from: -9, to: 10 });
  const sortedPoints = points.sort((a, b) => a[0] - b[0]);
  const tab = `
| | | | | |
|-|-|-|-|-|
|x|${sortedPoints[0][0]}|${sortedPoints[1][0]}|${sortedPoints[2][0]}|${sortedPoints[3][0]}|
|y|${sortedPoints[0][1]}|${sortedPoints[1][1]}|${sortedPoints[2][1]}|${sortedPoints[3][1]}|
  `;
  const instruction = `On considère la liste de points suivante : ${tab}
  
  Déterminer les coordonnées du point moyen $G$.
  `;
  const xG = frenchify(average(sortedPoints.map((el) => el[0])) + "");
  const yG = frenchify(average(sortedPoints.map((el) => el[1])) + "");
  const answer = `\\left(${xG};${yG}\\right)`;
  const question: Question<Identifiers> = {
    answer,
    instruction,
    keys: ["semicolon"],
    answerFormat: "tex",
    identifiers: {
      xValues: sortedPoints.map((el) => el[0]),
      yValues: sortedPoints.map((el) => el[1]),
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const wrongAnswer = `\\left(${frenchify(randint(-9, 10) + "")};${frenchify(
      randint(-9, 10) + "",
    )}\\right)`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { xValues, yValues }) => {
  const x = new Rational(
    xValues.reduce((acc, curr) => acc + curr),
    xValues.length,
  )
    .simplify()
    .toTree({ allowFractionToDecimal: true });
  const y = new Rational(
    yValues.reduce((acc, curr) => acc + curr),
    yValues.length,
  )
    .simplify()
    .toTree({ allowFractionToDecimal: true });
  const point = new PointNode(new Point("G", x, y));
  const texs = point.toAllValidTexs();
  return texs.includes(ans);
};

export const averagePoint: Exercise<Identifiers> = {
  id: "averagePoint",
  connector: "=",
  label: "Déterminer le point moyen",
  levels: ["1rePro", "1reTech", "TermTech", "TermPro", "MathComp"],
  isSingleStep: true,
  sections: ["Statistiques"],
  generator: (nb: number) => getDistinctQuestions(getAveragePointQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
