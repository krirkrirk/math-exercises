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
import { equationKeys } from "#root/exercises/utils/keys/equationKeys";
import { Integer } from "#root/math/numbers/integer/integer";
import { Rational } from "#root/math/numbers/rationals/rational";
import { Affine } from "#root/math/polynomials/affine";
import { DiscreteSet } from "#root/math/sets/discreteSet";
import { Interval } from "#root/math/sets/intervals/intervals";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";

/**
 *  type ax+b=c
 */
type Identifiers = {
  a: number;
  b: number;
  c: number;
};

const getEquationType3ExerciseQuestion: QuestionGenerator<Identifiers> = () => {
  const b = randint(-10, 11, [0]);
  const a = randint(-10, 11, [0, 1]);
  const c = randint(-10, 11);

  const affine = new Affine(a, b).toTree();
  const solution = new Rational(c - b, a).simplify();
  const statementTree = new EqualNode(affine, new NumberNode(c));
  const answerTree = new EqualNode(new VariableNode("x"), solution.toTree());
  const answer = answerTree.toTex();
  const question: Question<Identifiers> = {
    instruction: `Résoudre : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: equationKeys,
    answerFormat: "tex",
    identifiers: { a, b, c },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongAnswer = new Rational(
      c - b + randint(-7, 8, [0, -c + b]),
      a + randint(-7, 8, [-a, 0]),
    ).simplify();
    tryToAddWrongProp(
      propositions,
      new EqualNode(new VariableNode("x"), wrongAnswer.toTree()).toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c }) => {
  const solution = new Rational(c - b, a).simplify().toTree();
  const answerTree = new EquationSolutionNode(new DiscreteSetNode([solution]), {
    opts: { allowFractionToDecimal: true, allowRawRightChildAsSolution: true },
  });
  const validLatexs = answerTree.toAllValidTexs();
  return validLatexs.includes(ans);
};

export const equationType3Exercise: MathExercise<Identifiers> = {
  id: "equa3",

  connector: "\\iff",
  label: "Équations $ax+b=c$",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  sections: ["Équations"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getEquationType3ExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
