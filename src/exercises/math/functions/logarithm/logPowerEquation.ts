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
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { Log10Node } from "#root/tree/nodes/functions/log10Node";
import { LogNode } from "#root/tree/nodes/functions/logNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { KeyId } from "#root/types/keyIds";

type Identifiers = {
  a: number;
  powered: number;
  c: number;
  k: number;
  isLog10: boolean;
};

/**a*b^x+c=d */
const getLogPowerEquationQuestion: QuestionGenerator<
  Identifiers,
  { isLog10: boolean }
> = (opts) => {
  const powered = randint(2, 8);
  const a = randint(1, 10, [powered]);
  const c = randint(-5, 5, [a]);
  const k = randint(5, 15, [powered]);
  const d = k * a + c;
  const xNode = new VariableNode("x");
  const poweredNode = new NumberNode(powered);
  const LNode = opts?.isLog10 ? Log10Node : LogNode;

  const answer = new EquationSolutionNode(
    new DiscreteSetNode([
      new FractionNode(
        new LNode(new NumberNode(k)),
        new LNode(poweredNode),
      ).simplify(),
    ]),
  ).toTex();
  const equation = new EqualNode(
    new AddNode(
      new MultiplyNode(new NumberNode(a), new PowerNode(poweredNode, xNode)),
      new NumberNode(c),
    ).simplify(),
    new NumberNode(d),
  );
  const keys: KeyId[] = [
    "log",
    "x",
    "equal",
    "S",
    "lbrace",
    "semicolon",
    "rbrace",
  ];
  keys.push(opts?.isLog10 ? "log" : "ln");
  const question: Question<Identifiers> = {
    answer,
    instruction: `Résoudre : $${equation.toTex()}$`,
    keys,
    answerFormat: "tex",
    identifiers: { a, c, k, powered, isLog10: opts?.isLog10 ?? false },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isLog10, a, c, k, powered },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const LNode = isLog10 ? Log10Node : LogNode;
  const withoutLogs = new EquationSolutionNode(
    new DiscreteSetNode([
      new FractionNode(new NumberNode(k), new NumberNode(powered)).simplify(),
    ]),
  );
  tryToAddWrongProp(propositions, withoutLogs.toTex());
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new EquationSolutionNode(
        new DiscreteSetNode([
          new FractionNode(
            new LNode(new NumberNode(randint(2, 10))),
            new LNode(new NumberNode(randint(2, 10))),
          ).simplify(),
        ]),
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { a, c, k, powered, isLog10 },
) => {
  const LNode = isLog10 ? Log10Node : LogNode;

  const poweredNode = new NumberNode(powered);
  const answerSimp = new EquationSolutionNode(
    new DiscreteSetNode([
      new FractionNode(
        new LNode(new NumberNode(k)),
        new LNode(poweredNode),
      ).simplify(),
    ]),
  );
  const answer = new EquationSolutionNode(
    new DiscreteSetNode([
      new FractionNode(new LNode(new NumberNode(k)), new LNode(poweredNode)),
    ]),
  );
  const texs = [...answerSimp.toAllValidTexs(), ...answer.toAllValidTexs()];
  return texs.includes(ans);
};
export const logPowerEquation: Exercise<Identifiers> = {
  id: "logPowerEquation",
  connector: "\\iff",
  label:
    "Résoudre une équation du type $a\\times b^x + c = d$ grâce au logarithme népérien",
  levels: ["TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Logarithme népérien", "Puissances"],
  generator: (nb: number) =>
    getDistinctQuestions(getLogPowerEquationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};

export const log10PowerEquation: Exercise<Identifiers> = {
  id: "log10PowerEquation",
  connector: "\\iff",
  label:
    "Résoudre une équation du type $a\\times b^x + c = d$ grâce au logarithme décimal",
  levels: ["TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Logarithme décimal", "Puissances"],
  generator: (nb: number) =>
    getDistinctQuestions(
      () => getLogPowerEquationQuestion({ isLog10: true }),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
