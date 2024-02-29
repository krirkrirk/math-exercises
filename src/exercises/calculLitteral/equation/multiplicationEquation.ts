import {
  MathExercise,
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
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  a: number;
  b: number;
  c: number;
  d: number;
};

const getMultiplicationEquation: QuestionGenerator<Identifiers> = () => {
  // (ax + b)(cx + d) = 0
  let a, b, c, d;
  do {
    a = randint(-9, 10, [0]);
    b = randint(-9, 10, [0]);
    c = randint(-9, 10, [0]);
    d = randint(-9, 10, [0]);
  } while (a / c === b / d);

  const polynome1 = new Polynomial([b, a]);
  const polynome2 = new Polynomial([d, c]);
  const sol1 = new Rational(-b, a).simplify().toTree();
  const sol2 = new Rational(-d, c).simplify().toTree();
  const sortedSols = -b / a < -d / c ? [sol1, sol2] : [sol2, sol1];
  const answer = new EquationSolutionNode(
    new DiscreteSetNode(sortedSols),
  ).toTex();

  const question: Question<Identifiers> = {
    instruction: `Résoudre : $(${polynome1.toTex()})(${polynome2.toTex()}) = 0$`,
    startStatement: `(${polynome1.toTex()})(${polynome2.toTex()}) = 0`,
    answer,
    keys: ["x", "S", "equal", "lbrace", "rbrace", "semicolon", "ou"],
    answerFormat: "tex",
    identifiers: { a, b, c, d },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, c, d },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    let a: number, b: number, c: number, d: number;
    do {
      a = randint(-9, 10, [0]);
      b = randint(-9, 10, [0]);
      c = randint(-9, 10, [0]);
      d = randint(-9, 10, [0]);
    } while (a / c === b / d);

    const sol1 = new Rational(-b, a).simplify().toTree();
    const sol2 = new Rational(-d, c).simplify().toTree();
    const sortedSols = -b / a < -d / c ? [sol1, sol2] : [sol2, sol1];
    const wrongAnswer = new EquationSolutionNode(
      new DiscreteSetNode(sortedSols),
    ).toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c, d }) => {
  const sol1 = new Rational(-b, a).simplify().toTree();
  const sol2 = new Rational(-d, c).simplify().toTree();
  const sortedSols = -b / a < -d / c ? [sol1, sol2] : [sol2, sol1];
  const answer = new EquationSolutionNode(new DiscreteSetNode(sortedSols), {
    opts: { allowFractionToDecimal: true },
  });
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const multiplicationEquation: MathExercise<Identifiers> = {
  id: "multiplicationEquation",
  connector: "\\iff",
  label: "Résoudre une équation produit nul",
  levels: ["2nde", "1reESM", "1reSpé", "1reTech"],
  sections: ["Équations"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getMultiplicationEquation, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
