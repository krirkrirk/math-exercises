import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/alea/shuffle";
import { v4 } from "uuid";

type Identifiers = {
  a: number;
};

const getRootFunctionDerivative: QuestionGenerator<Identifiers> = () => {
  const a = randint(-19, 20, [0]);

  let instruction = `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =$ `;
  let answer = "";

  if (a === 1) instruction += `$\\sqrt{x}$.`;
  else if (a === -1) instruction += `$-\\sqrt{x}$.`;
  else instruction += `$${a}\\sqrt{x}$.`;

  if (a % 2 === 0)
    answer = `${a < 0 ? "-" : ""}\\frac{${Math.abs(a / 2)}}{\\sqrt{x}}`;
  else answer = `${a < 0 ? "-" : ""}\\frac{${Math.abs(a)}}{2\\sqrt{x}}`;

  const question: Question<Identifiers> = {
    instruction,
    startStatement: `f'(x)`,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, `\\frac{${a}}{\\sqrt(x)}`);
  tryToAddWrongProp(propositions, `${a}`);
  tryToAddWrongProp(propositions, `\\frac{${a}}{x}`);

  while (propositions.length < n) {
    const randomA = randint(-9, 10, [0]);
    const isEvenA = randomA / 2 === round(randomA / 2, 0);
    if (isEvenA) {
      tryToAddWrongProp(propositions, `\\frac{${randomA / 2}}{\\sqrt{x}}`);
    } else {
      tryToAddWrongProp(propositions, `\\frac{${randomA}}{2\\sqrt{x}}`);
    }
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a }) => {
  let answer: Node;
  if (a % 2 === 0)
    answer = new FractionNode(
      new NumberNode(a / 2),
      new SqrtNode(new VariableNode("x")),
    );
  else
    answer = new FractionNode(
      new NumberNode(a),
      new MultiplyNode(new NumberNode(2), new SqrtNode(new VariableNode("x"))),
    );
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};
export const rootFunctionDerivative: Exercise<Identifiers> = {
  id: "rootFunctionDerivative",
  connector: "=",
  label: "Dérivée d'une fonction racine",
  levels: ["1reESM", "1reSpé", "1reTech", "MathComp"],
  sections: ["Dérivation", "Racines carrées"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getRootFunctionDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
