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
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { alignTex } from "#root/utils/alignTex";
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
  const statementTex = new MultiplyNode(
    polynome1.toTree(),
    polynome2.toTree(),
  ).toTex();

  const question: Question<Identifiers> = {
    instruction: `Résoudre : $${statementTex} = 0$`,
    startStatement: `${statementTex} = 0`,
    answer,
    keys: ["x", "S", "equal", "lbrace", "rbrace", "semicolon", "ou"],
    answerFormat: "tex",
    identifiers: { a, b, c, d },
    hint: "Un produit est nul si et seulement si un des deux facteurs est nul. Donc, il faut trouver les valeurs de $x$ qui rendent un des deux facteurs nuls.",
    correction: `Un produit est nul si et seulement si un des deux facteurs est nul. On résout donc deux équations : 
    
${alignTex([
  ["", `${statementTex} = 0`],
  [
    "\\iff",
    `${polynome1.toTree().toTex()} = 0 \\text{ ou } ${polynome2
      .toTree()
      .toTex()} = 0`,
  ],
  ["\\iff", `x=${sol1.toTex()} \\text{ ou } x=${sol2.toTex()}`],
])}
  
  Ainsi, $${answer}$`,
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

export const multiplicationEquation: Exercise<Identifiers> = {
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
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
