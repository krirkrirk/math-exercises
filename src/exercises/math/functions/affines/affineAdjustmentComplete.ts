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
  G1x: number;
  G2x: number;
  G2y: number;
  G1y: number;
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

const getAffineAdjustmentCompleteQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const data = generateLinearData(10);
  data.sort((a, b) => a.x - b.x);

  const xValues = data.map((point) => point.x);
  const yValues = data.map((point) => point.y);

  const G1x = round(
    (xValues[0] + xValues[1] + xValues[2] + xValues[3] + xValues[4]) / 5,
    2,
  );
  const G2x = round(
    (xValues[5] + xValues[6] + xValues[7] + xValues[8] + xValues[9]) / 5,
    2,
  );
  const G1y = round(
    (yValues[0] + yValues[1] + yValues[2] + yValues[3] + yValues[4]) / 5,
    2,
  );
  const G2y = round(
    (yValues[5] + yValues[6] + yValues[7] + yValues[8] + yValues[9]) / 5,
    2,
  );

  const rSquared = calculateRSquared(xValues, yValues);

  const a = (G2y - G1y) / (G2x - G1x);
  const afixed = round(a, 2);
  const b = G2y - a * G2x;
  const bfixed = round(b, 2);

  const answerEq = new EqualNode(
    new VariableNode("y"),
    new AddNode(
      new MultiplyNode(new NumberNode(afixed), new VariableNode("x")),
      new NumberNode(bfixed),
    ).simplify({ forbidFactorize: true }),
  ).toTex();

  const answerR = new EqualNode(
    new PowerNode(new VariableNode("R"), new NumberNode(2)),
    round(rSquared, 2).toTree(),
  ).toTex();

  let dataTable = `
| | | | | | | | | | | |
|-|-|-|-|-|-|-|-|-|-|-|
| x | ${xValues.join(" | ")} |
| y | ${yValues.join(" | ")} |
  `;

  const question: Question<Identifiers> = {
    answer: `${answerEq}\\qquad ${answerR}`,
    instruction: `Déterminer l'équation de la droite d'ajustement et la valeur du coefficient de détermination avec la calculatrice. Arrondir au centième : ${dataTable}
`,
    keys: [],
    answerFormat: "tex",
    identifiers: { G1x, G2x, G1y, G2y, rSquared },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, G1x, G2x, G1y, G2y, rSquared },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "tex");

  const a = (G2y - G1y) / (G2x - G1x);
  const afixed = round(a, 2);
  const b = G2y - a * G2x;
  const bfixed = round(b, 2);

  const answerEq = new EqualNode(
    new VariableNode("y"),
    new AddNode(
      new MultiplyNode(new NumberNode(afixed), new VariableNode("x")),
      new NumberNode(bfixed),
    ).simplify({ forbidFactorize: true }),
  ).toTex();

  const answerR = new EqualNode(
    new PowerNode(new VariableNode("R"), new NumberNode(2)),
    round(rSquared, 2).toTree(),
  ).toTex();

  const wrongAnswerEq1 = new EqualNode(
    new VariableNode("y"),
    new SubstractNode(
      new MultiplyNode(new NumberNode(afixed), new VariableNode("x")),
      new NumberNode(bfixed),
    ).simplify({ forbidFactorize: true }),
  ).toTex();

  const awrong = (G2x - G1x) / (G2y - G1y);

  const wrongAnswerEq2 = new EqualNode(
    new VariableNode("y"),
    new AddNode(
      new MultiplyNode(new NumberNode(round(awrong, 2)), new VariableNode("x")),
      new NumberNode(bfixed),
    ).simplify({ forbidFactorize: true }),
  ).toTex();

  const wrongAnswerR1 = new EqualNode(
    new VariableNode("R"),
    round(rSquared, 2).toTree(),
  ).toTex();

  const wrongAnswerR2 = new EqualNode(
    new PowerNode(new VariableNode("R"), new NumberNode(2)),
    (-round(rSquared, 2)).toTree(),
  ).toTex();

  const wrongAnswer1 = `${answerEq}\\qquad ${wrongAnswerR1}`;
  const wrongAnswer2 = `${answerEq}\\qquad ${wrongAnswerR2}`;
  const wrongAnswer3 = `${wrongAnswerEq1}\\qquad ${answerR}`;
  const wrongAnswer4 = `${wrongAnswerEq2}\\qquad ${answerR}`;

  tryToAddWrongProp(propositions, wrongAnswer1);
  tryToAddWrongProp(propositions, wrongAnswer2);
  tryToAddWrongProp(propositions, wrongAnswer3);
  tryToAddWrongProp(propositions, wrongAnswer4);

  while (propositions.length < n) {
    const a = randint(-10, 10, [0]);
    const b = randint(-10, 10);
    const wrongAnswerEq = new EqualNode(
      new VariableNode("y"),
      new AddNode(
        new MultiplyNode(new NumberNode(a), new VariableNode("x")),
        new NumberNode(b),
      ).simplify({ forbidFactorize: true }),
    ).toTex();
    const wrongAnswerR = new EqualNode(
      new PowerNode(new VariableNode("R"), new NumberNode(2)),
      round(Math.random(), 2).toTree(),
    ).toTex();

    const wrongAnswer = `${wrongAnswerEq}\\qquad ${wrongAnswerR}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const affineAdjustmentCompleteExercise: Exercise<Identifiers> = {
  id: "affineAdjustmentComplete",
  label:
    "Déterminer l'équation de la droite d'ajustement et le coefficient de détermination",
  levels: ["1rePro"],
  isSingleStep: true,
  sections: ["Statistiques"],
  generator: (nb: number) =>
    getDistinctQuestions(getAffineAdjustmentCompleteQuestion, nb),
  answerType: "QCM",
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
