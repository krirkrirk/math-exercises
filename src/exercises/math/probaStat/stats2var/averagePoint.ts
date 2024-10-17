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
  GetInstruction,
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
import { dollarize } from "#root/utils/latex/dollarize";
import { mdTable } from "#root/utils/markdown/mdTable";
import { v4 } from "uuid";

type Identifiers = {
  xValues: number[];
  yValues: number[];
};

const getInstruction: GetInstruction<Identifiers> = ({ xValues, yValues }) => {
  const tab = mdTable([
    ["$x$", ...xValues.map((el) => dollarize(el))],
    ["$y$", ...yValues.map((el) => dollarize(el))],
  ]);
  return `On considère la liste de points suivante : ${tab}
  
  Déterminer les coordonnées du point moyen $G$.
  `;
};
const getAveragePointQuestion: QuestionGenerator<Identifiers> = () => {
  const points = distinctRandTupleInt(4, 2, { from: -9, to: 10 });
  const sortedPoints = points.sort((a, b) => a[0] - b[0]);

  const xG = frenchify(average(sortedPoints.map((el) => el[0])) + "");
  const yG = frenchify(average(sortedPoints.map((el) => el[1])) + "");
  const answer = `\\left(${xG};${yG}\\right)`;
  const identifiers = {
    xValues: sortedPoints.map((el) => el[0]),
    yValues: sortedPoints.map((el) => el[1]),
  };
  const question: Question<Identifiers> = {
    answer,
    instruction: getInstruction(identifiers),
    keys: ["semicolon"],
    answerFormat: "tex",
    identifiers: {
      xValues: sortedPoints.map((el) => el[0]),
      yValues: sortedPoints.map((el) => el[1]),
    },
    style: { tableHasNoHeader: true },
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
  getInstruction,
};
