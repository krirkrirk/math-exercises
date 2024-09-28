import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  addWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  Interval,
  IntervalConstructor,
} from "#root/math/sets/intervals/intervals";
import { InequationNode } from "#root/tree/nodes/inequations/inequationNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { BelongsNode } from "#root/tree/nodes/sets/belongsNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  intervalMin: number | string;
  intervalMax: number | string;
  intervalClosure: ClosureType;
};

const getIntervalToInequalityQuestion: QuestionGenerator<Identifiers> = () => {
  const interval = IntervalConstructor.random();
  const inequalityString = interval.toInequality();
  const answer = inequalityString;
  const instruction = `Soit $x \\in ${interval.toTex()}$. Traduire cette appartenance en une inégalité.`;

  const question: Question<Identifiers> = {
    answer,
    instruction: instruction,
    keys: ["x", "inf", "sup", "geq", "leq", "infty"],
    answerFormat: "tex",
    identifiers: {
      intervalMin: interval.min === -Infinity ? "-infty" : interval.min,
      intervalMax: interval.max === Infinity ? "infty" : interval.max,
      intervalClosure: interval.closure,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, intervalClosure, intervalMax, intervalMin },
) => {
  const switchInclusion = (symbol: "\\le" | "<" | "\\ge" | ">") => {
    if (symbol === "\\le") return "<";
    if (symbol === "<") return "\\le";
    if (symbol === ">") return "\\ge";
    return ">";
  };
  const reverseInequality = (symbol: "\\le" | "<" | "\\ge" | ">") => {
    if (symbol === "\\le") return "\\ge";
    if (symbol === "<") return ">";
    if (symbol === ">") return "<";
    return "\\le";
  };

  const min = intervalMin === "-infty" ? -Infinity : intervalMin;
  const max = intervalMax === "infty" ? Infinity : intervalMax;
  const interval = new Interval(min.toTree(), max.toTree(), intervalClosure);
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const xNode = new VariableNode("x");
  let wrongIneqs: InequationNode[] = [];

  if (interval.min === -Infinity) {
    wrongIneqs = [
      new InequationNode(
        [xNode, new NumberNode(interval.max)],
        switchInclusion(interval.rightInequalitySymbol),
      ),
      new InequationNode(
        [xNode, new NumberNode(interval.max)],
        reverseInequality(switchInclusion(interval.rightInequalitySymbol)),
      ),
      new InequationNode(
        [xNode, new NumberNode(interval.max)],
        reverseInequality(interval.rightInequalitySymbol),
      ),
    ];
  } else if (interval.max === Infinity) {
    wrongIneqs = [
      new InequationNode(
        [xNode, new NumberNode(interval.min)],
        switchInclusion(interval.leftInequalitySymbol),
      ),
      new InequationNode(
        [xNode, new NumberNode(interval.min)],
        reverseInequality(switchInclusion(interval.leftInequalitySymbol)),
      ),
      new InequationNode(
        [xNode, new NumberNode(interval.min)],
        interval.leftInequalitySymbol,
      ),
    ];
  } else {
    wrongIneqs = [
      new InequationNode(
        [new NumberNode(interval.min), xNode, new NumberNode(interval.max)],
        [
          switchInclusion(interval.leftInequalitySymbol),
          interval.rightInequalitySymbol,
        ],
      ),
      new InequationNode(
        [new NumberNode(interval.min), xNode, new NumberNode(interval.max)],
        [
          interval.leftInequalitySymbol,
          switchInclusion(interval.rightInequalitySymbol),
        ],
      ),
      new InequationNode(
        [new NumberNode(interval.min), xNode, new NumberNode(interval.max)],
        [
          switchInclusion(interval.leftInequalitySymbol),
          switchInclusion(interval.rightInequalitySymbol),
        ],
      ),
    ];
  }
  wrongIneqs.forEach((ineq) => {
    addWrongProp(propositions, ineq.toTex());
  });

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { intervalClosure, intervalMax, intervalMin },
) => {
  const min = intervalMin === "-infty" ? -Infinity : intervalMin;
  const max = intervalMax === "infty" ? Infinity : intervalMax;
  const interval = new Interval(
    min.toTree(),
    max.toTree(),
    intervalClosure,
  ).toTree();
  const inequality = interval.toInequality();

  const answer = inequality;

  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const intervalToInequality: Exercise<Identifiers> = {
  id: "intervalToInequality",
  connector: "=",
  label: "Traduire un intervalle en inégalité",
  levels: ["2ndPro", "2nde", "CAP", "1reESM"],
  isSingleStep: true,
  sections: ["Ensembles et intervalles"],
  generator: (nb: number) =>
    getDistinctQuestions(getIntervalToInequalityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
