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
import { round } from "#root/math/utils/round";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { DivideNode } from "#root/tree/nodes/operators/divideNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { roundToCentieme } from "../../calcul";

type Identifiers = {
  rSquared: number;
};

function generateLinearData(n: number) {
  const slope = randint(-500, 500, [0]) / 100;
  const intercept = randint(100, 5000) / 100;
  let data = [];
  let generatedXs = new Set();

  while (data.length < n) {
    let x = randint(1, 100);
    while (generatedXs.has(x)) {
      x = randint(1, 100);
    }
    generatedXs.add(x);
    let noise = Math.random() * 100;
    let y = round(slope * x + intercept + noise, 2);
    data.push({ x, y });
  }
  return data;
}

function calculateRSquared(xValues: number[], yValues: number[]) {
  const n = xValues.length;
  const sumX = xValues.reduce((acc, x) => acc + x, 0);
  const sumY = yValues.reduce((acc, y) => acc + y, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0);
  const sumY2 = yValues.reduce((acc, y) => acc + y * y, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY),
  );
  const r = numerator / denominator;
  const rSquared = r * r;

  return rSquared;
}

const getAffineAdjustmentRsquaredQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const data = generateLinearData(10);
  data.sort((a, b) => a.x - b.x);

  const xValues = data.map((point) => round(point.x, 2));
  const yValues = data.map((point) => round(point.y, 2));

  const rSquared = calculateRSquared(xValues, yValues);

  const answer = new EqualNode(
    new PowerNode(new VariableNode("R"), new NumberNode(2)),
    round(rSquared, 2).toTree(),
  ).toTex();

  let dataTable = `
| | | | | | | | | | | |
|-|-|-|-|-|-|-|-|-|-|-|
| $x$ | ${xValues.join(" | ")} |
| $y$ | ${yValues.map((n) => n.frenchify()).join(" | ")} |
  `;

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `On considère la série statistique ci-dessous. Déterminez la valeur du coefficient de détermination. ${dataTable}
`,
    keys: ["R", "equal"],
    answerFormat: "tex",
    identifiers: { rSquared },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, rSquared },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "tex");

  const wrongAnswer1 = new EqualNode(
    new VariableNode("R"),
    round(rSquared, 2).toTree(),
  ).toTex();

  const wrongAnswer2 = new EqualNode(
    new PowerNode(new VariableNode("R"), new NumberNode(2)),
    (-round(rSquared, 2)).toTree(),
  ).toTex();

  const wrongAnswer3 = new EqualNode(
    new VariableNode("R"),
    (-round(rSquared, 2)).toTree(),
  ).toTex();

  tryToAddWrongProp(propositions, wrongAnswer1);
  tryToAddWrongProp(propositions, wrongAnswer2);
  tryToAddWrongProp(propositions, wrongAnswer3);

  while (propositions.length < n) {
    const wrongAnswer = new EqualNode(
      new PowerNode(new VariableNode("R"), new NumberNode(2)),
      round(Math.random(), 2).toTree(),
    ).toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { rSquared }) => {
  const valid = new EqualNode(
    new PowerNode(new VariableNode("R"), new NumberNode(2)),
    round(rSquared, 2).toTree(),
  );

  const latexs = valid.toAllValidTexs({
    allowRawRightChildAsSolution: true,
    allowFractionToDecimal: true,
  });

  return latexs.includes(ans);
};

export const affineAdjustmentRsquaredExercise: Exercise<Identifiers> = {
  id: "affineAdjustmentRsquared",
  label:
    "Déterminer le coefficient de détermination à partir d'un tableau de données",
  levels: ["1rePro"],
  isSingleStep: true,
  sections: ["Statistiques"],
  generator: (nb: number) =>
    getDistinctQuestions(getAffineAdjustmentRsquaredQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
