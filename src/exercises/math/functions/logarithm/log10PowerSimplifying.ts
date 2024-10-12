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
import { Decimal } from "#root/math/numbers/decimals/decimal";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { Log10Node } from "#root/tree/nodes/functions/log10Node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { alignTex } from "#root/utils/latex/alignTex";
import { probaFlip } from "#root/utils/alea/probaFlip";

type Identifiers = {
  tenthPower: number;
  nbTex: string;
};

const getLog10PowerSimplifyingQuestion: QuestionGenerator<Identifiers> = () => {
  const tenthPower = randint(-6, 8, [1]);
  const nb = new Decimal(1).multiplyByPowerOfTen(tenthPower).toTree();
  const answer = tenthPower + "";
  const question: Question<Identifiers> = {
    answer,
    instruction: `Calculer : $${new Log10Node(nb).toTex()}$`,
    hint: getHint(nb),
    correction: getCorrection(tenthPower, nb),
    keys: [],
    answerFormat: "tex",
    identifiers: { tenthPower, nbTex: nb.toTex() },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, tenthPower },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, "10");
  tryToAddWrongProp(propositions, tenthPower + 1 + "");
  tryToAddWrongProp(propositions, tenthPower + 2 + "");
  tryToAddWrongProp(propositions, tenthPower - 1 + "");
  tryToAddWrongProp(propositions, tenthPower - 2 + "");
  return shuffleProps(propositions, n);
};

const getHint = (nb: AlgebraicNode) => {
  return `Pour calculer $\\log(⁡${nb.toTex()})$, il est utile de transformer le nombre $${nb.toTex()}$ en une puissance de $10$.`;
};
const getCorrection = (tenthPower: number, nb: AlgebraicNode) => {
  const powerTen = new PowerNode((10).toTree(), tenthPower.toTree());
  return `On exprime $${nb.toTex()}$ en puissance de $10$ :
  ${alignTex(`${nb.toTex()} = ${powerTen.toTex()}`)}
  On utilise la propriété $\\log(a^{b}) = b\\times \\log(a)$.

  On a alors
  ${alignTex([
    [`\\log(${nb.toTex()})`, `=`, `\\log(${powerTen.toTex()})`],
    ["", "=", `${tenthPower}\\times \\log(10)`],
    ["", "=", `${tenthPower}`],
  ])}
  `;
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, tenthPower }) => {
  return ans === answer;
};
export const log10PowerSimplifying: Exercise<Identifiers> = {
  id: "log10PowerSimplifying",
  connector: "=",
  label: "Calculer un logarithme décimal",
  levels: ["TermTech", "MathComp"],
  isSingleStep: true,
  sections: ["Logarithme décimal", "Puissances"],
  generator: (nb: number) =>
    getDistinctQuestions(getLog10PowerSimplifyingQuestion, nb, 10),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  maxAllowedQuestions: 10,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
