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
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { roundToCentieme } from "../../calcul";

type Identifiers = {
  G1x: number;
  G2x: number;
  G2y: number;
  G1y: number;
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
    let y = round(slope * x + intercept, 2);
    data.push({ x, y });
  }
  return data;
}

const getAffineAdjustmentQuestion: QuestionGenerator<Identifiers> = () => {
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

  const a = (G2y - G1y) / (G2x - G1x);
  const afixed = round(a, 2);
  const b = G2y - a * G2x;
  const bfixed = round(b, 2);

  const answer = new EqualNode(
    new VariableNode("y"),
    new AddNode(
      new MultiplyNode(new NumberNode(afixed), new VariableNode("x")),
      new NumberNode(bfixed),
    ).simplify({ forbidFactorize: true }),
  ).toTex();

  let dataTable = `
| | | | | | | | | | | |
|-|-|-|-|-|-|-|-|-|-|-|
| x | ${xValues.join(" | ")} |
| y | ${yValues.join(" | ")} |
  `;

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `À partir des données fournies ci-dessous, déterminez l'équation de la droite d'ajustement : ${dataTable}
`,
    keys: ["equal", "y", "x", "a", "b"],
    answerFormat: "tex",
    identifiers: { G1x, G2x, G1y, G2y },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, G1x, G2x, G1y, G2y },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "tex");

  const a = (G2y - G1y) / (G2x - G1x);
  const afixed = round(a, 2);
  const b = G2y - a * G2x;
  const bfixed = round(b, 2);

  const wrongAnswer1 = new EqualNode(
    new VariableNode("y"),
    new SubstractNode(
      new MultiplyNode(new NumberNode(afixed), new VariableNode("x")),
      new NumberNode(bfixed),
    ).simplify({ forbidFactorize: true }),
  );

  const awrong = (G2x - G1x) / (G2y - G1y);
  const bwrong = G1y - a * G1x;

  const wrongAnswer2 = new EqualNode(
    new VariableNode("y"),
    new AddNode(
      new MultiplyNode(new NumberNode(round(awrong, 2)), new VariableNode("x")),
      new NumberNode(bfixed),
    ).simplify({ forbidFactorize: true }),
  );

  const wrongAnswer3 = new EqualNode(
    new VariableNode("y"),
    new AddNode(
      new MultiplyNode(new NumberNode(afixed), new VariableNode("x")),
      new NumberNode(round(bwrong, 2)),
    ).simplify({ forbidFactorize: true }),
  );

  const wrongAnswer4 = new EqualNode(
    new VariableNode("y"),
    new AddNode(
      new MultiplyNode(new NumberNode(round(awrong, 2)), new VariableNode("x")),
      new NumberNode(round(bwrong, 2)),
    ).simplify({ forbidFactorize: true }),
  );

  tryToAddWrongProp(propositions, wrongAnswer1.toTex());
  tryToAddWrongProp(propositions, wrongAnswer2.toTex());
  tryToAddWrongProp(propositions, wrongAnswer3.toTex());
  tryToAddWrongProp(propositions, wrongAnswer4.toTex());

  while (propositions.length < n) {
    const a = randint(-10, 10, [0]);
    const b = randint(-10, 10);
    const wrongAnswer = new EqualNode(
      new VariableNode("y"),
      new AddNode(
        new MultiplyNode(new NumberNode(a), new VariableNode("x")),
        new NumberNode(b),
      ).simplify({ forbidFactorize: true }),
    );
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { G1x, G2x, G1y, G2y }) => {
  const a = (G2y - G1y) / (G2x - G1x);
  const afixed = round(a, 2);
  const b = G2y - a * G2x;
  const bfixed = round(b, 2);

  const valid = new EqualNode(
    new VariableNode("y"),
    new AddNode(
      new MultiplyNode(new NumberNode(afixed), new VariableNode("x")),
      new NumberNode(bfixed),
    ).simplify({ forbidFactorize: true }),
  );

  const latexs = valid.toAllValidTexs({ allowRawRightChildAsSolution: true });

  return latexs.includes(ans);
};

export const affineAdjustmentExercise: Exercise<Identifiers> = {
  id: "affineAdjustment",
  label:
    "Déterminer l'équation de la droite d'ajustement à partir d'un tableau de données",
  levels: ["1rePro"],
  isSingleStep: true,
  sections: ["Statistiques"],
  generator: (nb: number) =>
    getDistinctQuestions(getAffineAdjustmentQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
