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
  isIntervalToInequality: boolean;
  intervalMin: number;
  intervalMax: number;
  intervalClosure: ClosureType;
};

const getInequalityToIntervalQuestion: QuestionGenerator<Identifiers> = () => {
  const isIntervalToInequality = coinFlip();
  const interval = IntervalConstructor.random();
  const inequalityString = interval.toInequality();
  const answer = isIntervalToInequality
    ? inequalityString
    : `x\\in${interval.toTex()}`;
  const instruction = isIntervalToInequality
    ? `Soit $x \\in ${interval.toTex()}$. Traduire cette appartenance en une inégalité.`
    : `Soit $${inequalityString}$. Traduire cette inégalité en appartenance à un intervalle.`;

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
      isIntervalToInequality: isIntervalToInequality,
      intervalMin: interval.min,
      intervalMax: interval.max,
      intervalClosure: interval.closure,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isIntervalToInequality, intervalClosure, intervalMax, intervalMin },
) => {
  const reverseBracket = (bracket: "]" | "[") => {
    return bracket === "[" ? "]" : "[";
  };
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

  const interval = new Interval(
    intervalMin.toTree(),
    intervalMax.toTree(),
    intervalClosure,
  );
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const xNode = new VariableNode("x");
  if (isIntervalToInequality) {
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
          reverseInequality(interval.leftInequalitySymbol),
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
  } else {
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
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { intervalClosure, intervalMax, intervalMin, isIntervalToInequality },
) => {
  const interval = new Interval(
    intervalMin.toTree(),
    intervalMax.toTree(),
    intervalClosure,
  ).toTree();
  console.log("int", interval.toTex());
  const inequality = interval.toInequality();

  const answer = isIntervalToInequality
    ? inequality
    : new BelongsNode(new VariableNode("x"), interval, {
        allowRawRightChildAsSolution: true,
      });
  console.log("ans", answer);

  const texs = answer.toAllValidTexs();
  console.log("texs", texs);
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
