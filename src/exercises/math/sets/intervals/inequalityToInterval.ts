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

const getInequalityToIntervalQuestion: QuestionGenerator<Identifiers> = () => {
  const interval = IntervalConstructor.random();
  const inequalityString = interval.toInequality();
  const answer = `x\\in${interval.toTex()}`;
  const instruction = `Soit $${inequalityString}$. Traduire cette inégalité en appartenance à un intervalle.`;

  const question: Question<Identifiers> = {
    answer,
    instruction: instruction,
    keys: [
      "x",
      "belongs",
      "inf",
      "sup",
      "geq",
      "leq",
      "lbracket",
      "rbracket",
      "semicolon",
      "infty",
    ],
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
  const reverseBracket = (bracket: "]" | "[") => {
    return bracket === "[" ? "]" : "[";
  };

  const min = intervalMin === "-infty" ? -Infinity : intervalMin;
  const max = intervalMax === "infty" ? Infinity : intervalMax;
  const interval = new Interval(min.toTree(), max.toTree(), intervalClosure);
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const wrongStatements = [
    `x\\in${reverseBracket(interval.leftBracket)}${interval.insideToTex()}${
      interval.rightBracket
    }`,
    `x\\in${interval.leftBracket}${interval.insideToTex()}${reverseBracket(
      interval.rightBracket,
    )}`,
    `x\\in${reverseBracket(
      interval.leftBracket,
    )}${interval.insideToTex()}${reverseBracket(interval.rightBracket)}`,
  ];
  wrongStatements.forEach((ineq) => {
    addWrongProp(propositions, ineq);
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
  const answer = new BelongsNode(new VariableNode("x"), interval, {
    allowRawRightChildAsSolution: true,
  });

  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const inequalityToInterval: Exercise<Identifiers> = {
  id: "inequalityToInterval",
  connector: "=",
  label: "Traduire une inégalité en intervalle",
  levels: ["2ndPro", "2nde", "CAP", "1reESM"],
  isSingleStep: true,
  sections: ["Ensembles et intervalles"],
  generator: (nb: number) =>
    getDistinctQuestions(getInequalityToIntervalQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
