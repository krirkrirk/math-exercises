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
import {
  DiscreteSetNode,
  EmptySet,
} from "#root/tree/nodes/sets/discreteSetNode";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  a: number;
  b: number;
  c: number;
  d: number;
};

const getFractionEquation: QuestionGenerator<Identifiers> = () => {
  // (ax + b)/(cx + d) = 0

  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10, [0]);
  const c = randint(-9, 10, [0]);
  const d = randint(-9, 10, [0]);

  const polynome1 = new Polynomial([b, a]);
  const polynome2 = new Polynomial([d, c]);

  const answer =
    -d / c === -b / a
      ? `S=\\varnothing`
      : `S=\\left\\{${new Rational(-b, a)
          .simplify()
          .toTree()
          .toTex()}\\right\\}`;

  const question: Question<Identifiers> = {
    instruction: `Résoudre : $\\frac{${polynome1.toTex()}}{${polynome2.toTex()}} = 0$`,

    startStatement: `\\frac{${polynome1.toTex()}}{${polynome2.toTex()}} = 0`,
    answer,
    keys: [
      "x",
      "S",
      "equal",
      "lbrace",
      "rbrace",
      "semicolon",
      "ou",
      "varnothing",
    ],
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
  tryToAddWrongProp(
    propositions,
    new EquationSolutionNode(
      new DiscreteSetNode([new Rational(-d, c).simplify().toTree()]),
    ).toTex(),
  );
  while (propositions.length < n) {
    const a = randint(-9, 10, [0]);
    const b = randint(-9, 10, [0]);
    const wrongAnswer = `S=\\left\\{${new Rational(-b, a)
      .simplify()
      .toTree()
      .toTex()}\\right\\}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c, d }) => {
  const solutions =
    -d / c === -b / a
      ? EmptySet
      : new DiscreteSetNode([new Rational(-b, a).simplify().toTree()]);
  const answer = new EquationSolutionNode(solutions, {
    opts: { allowFractionToDecimal: true },
  });
  const validLatexs = answer.toAllValidTexs();
  return validLatexs.includes(ans);
};
export const fractionEquation: MathExercise<Identifiers> = {
  id: "fractionEquation",
  connector: "\\iff",
  label: "Résoudre une équation quotient nul",
  levels: ["2nde", "1reESM", "1reSpé", "1reTech"],
  sections: ["Équations"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionEquation, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
