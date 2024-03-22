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

/**
 *  type ax=b
 */
type Identifiers = {
  a: number;
  b: number;
};

const getEquationType2ExerciseQuestion: QuestionGenerator<Identifiers> = () => {
  const b = randint(-10, 11);
  const a = randint(-9, 10, [0, 1]);
  const solution = new Rational(b, a).simplify();
  const affine = new Affine(a, 0).toTree();
  const tree = new EqualNode(affine, b.toTree());
  const answer = new EqualNode(
    new VariableNode("x"),
    solution.toTree(),
  ).toTex();

  const question: Question<Identifiers> = {
    instruction: `Résoudre : $${tree.toTex()}$`,
    startStatement: tree.toTex(),
    answer,
    keys: equationKeys,
    answerFormat: "tex",
    identifiers: { a, b: b },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongAnswer = new Rational(
      b + randint(-7, 8, [0, -b]),
      a + randint(-7, 8, [-a, 0]),
    ).simplify();
    tryToAddWrongProp(
      propositions,
      new EqualNode(new VariableNode("x"), wrongAnswer.toTree()).toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b }) => {
  const solution = new Rational(b, a).simplify().toTree();
  const answerTree = new EquationSolutionNode(new DiscreteSetNode([solution]), {
    opts: { allowFractionToDecimal: true, allowRawRightChildAsSolution: true },
  });

  const validLatexs = answerTree.toAllValidTexs();
  console.log(validLatexs);
  return validLatexs.includes(ans);
};

export const equationType2Exercise: Exercise<Identifiers> = {
  id: "equa2",
  connector: "\\iff",
  label: "Équations $ax=b$",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  sections: ["Équations"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getEquationType2ExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
