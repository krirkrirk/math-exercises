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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { Node } from "#root/tree/nodes/node";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  a: number;
  b: number;
  askingPositive: boolean;
};

const getSignFunction: QuestionGenerator<Identifiers> = () => {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);
  const affine = new Polynomial([b, a]);

  let instruction = `Soit $f$ la fonction définie par : $f(x) = ${affine.toTex()}$. Sur quel intervalle $f$ est-elle `;
  let answer = "";
  const askingPositive = coinFlip();
  const root = new Rational(-b, a).simplify().toTree();
  const toRightInfInterval = new IntervalNode(
    root,
    PlusInfinityNode,
    ClosureType.FO,
  ).toTex();
  const toLeftInfInteral = new IntervalNode(
    MinusInfinityNode,
    root,
    ClosureType.OF,
  ).toTex();
  if (askingPositive) {
    instruction += "positive ?";
    answer = a > 0 ? toRightInfInterval : toLeftInfInteral;
  } else {
    instruction += "négative ?";
    answer = a > 0 ? toLeftInfInteral : toRightInfInterval;
  }

  const question: Question<Identifiers> = {
    instruction,
    startStatement: "S",
    answer,
    keys: ["S", "equal", "lbracket", "rbracket", "semicolon", "infty"],
    answerFormat: "tex",
    identifiers: { a, askingPositive, b },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const a = randint(-9, 10, [0]);
    const b = randint(-9, 10);
    const root = new Rational(-b, a).simplify().toTree();
    const leftInf = new IntervalNode(
      MinusInfinityNode,
      root,
      ClosureType.OF,
    ).toTex();
    const rightInf = new IntervalNode(
      root,
      PlusInfinityNode,
      ClosureType.FO,
    ).toTex();
    const wrongAnswer = coinFlip() ? rightInf : leftInf;

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, askingPositive }) => {
  const root = new Rational(-b, a)
    .simplify()
    .toTree({ allowFractionToDecimal: true });
  const toRightInfInterval = new IntervalNode(
    root,
    PlusInfinityNode,
    ClosureType.FO,
  );
  const toLeftInfInteral = new IntervalNode(
    MinusInfinityNode,
    root,
    ClosureType.OF,
  );
  let answer: Node;
  if (askingPositive) {
    answer = a > 0 ? toRightInfInterval : toLeftInfInteral;
  } else {
    answer = a > 0 ? toLeftInfInteral : toRightInfInterval;
  }
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const signFunction: Exercise<Identifiers> = {
  id: "signFunction",
  connector: "=",
  label: "Signe d'une fonction affine",
  levels: ["3ème", "2nde", "2ndPro", "1rePro", "1reTech"],
  sections: ["Fonctions affines"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getSignFunction, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
