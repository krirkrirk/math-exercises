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
import { Log10Node } from "#root/tree/nodes/functions/log10Node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { coinFlip } from "#root/utils/coinFlip";
import { probaFlip } from "#root/utils/probaFlip";

type Identifiers = {
  tenthPower: number;
  nbTex: string;
};

const getLog10PowerSimplifyingQuestion: QuestionGenerator<Identifiers> = () => {
  const tenthPower = randint(-5, 6, [0, 1]);
  const shouldEvaluate = probaFlip(0.7);
  console.log("log10 power simp q");
  const nb = shouldEvaluate
    ? new Decimal(1).multiplyByPowerOfTen(tenthPower).toTree()
    : new PowerNode(new NumberNode(10), new NumberNode(tenthPower));
  const answer = tenthPower + "";
  const question: Question<Identifiers> = {
    answer,
    instruction: `Calculer : $${new Log10Node(nb).toTex()}$`,
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
    getDistinctQuestions(getLog10PowerSimplifyingQuestion, nb, 15),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  maxAllowedQuestions: 15,
  subject: "Mathématiques",
};
