import {
  MathExercise,
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
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { Log10Node } from "#root/tree/nodes/functions/log10Node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {};

/**a*b^x+c=d */
const getLogPowerEquationQuestion: QuestionGenerator<
  Identifiers,
  { isLog10: boolean }
> = (opts) => {
  const powered = randint(2, 8);
  const a = randint(1, 10);
  const c = randint(-5, 5);
  const k = randint(5, 15, [powered, 10]);
  const d = k * a + c;
  const xNode = new VariableNode("x");
  const poweredNode = new NumberNode(powered);
  const answer = new EquationSolutionNode(
    new DiscreteSetNode([
      new FractionNode(
        new Log10Node(new NumberNode(k)),
        new Log10Node(poweredNode),
      ),
    ]),
  ).toTex();
  const equation = new EqualNode(
    new AddNode(
      new MultiplyNode(new NumberNode(a), new PowerNode(poweredNode, xNode)),
      new NumberNode(c),
    ),
    new NumberNode(d),
  );
  const question: Question<Identifiers> = {
    answer,
    instruction: `Résoudre : $${equation.toTex()}$`,
    keys: ["log", "x", "equal", "lbrace", "semicolon", "rbrace"],
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {}
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return true;
};
export const logPowerEquation: MathExercise<Identifiers> = {
  id: "logPowerEquation",
  connector: "\\iff",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getLogPowerEquationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
export const log10PowerEquation: MathExercise<Identifiers> = {
  id: "log10PowerEquation",
  connector: "\\iff",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(
      () => getLogPowerEquationQuestion({ isLog10: true }),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
