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
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/shuffle";
import { alignTex } from "#root/utils/latex/alignTex";

/**
 *  type ax+b=cx+d
 */

type Identifiers = {
  a: number;
  b: number;
  c: number;
  d: number;
};

const getEquationType4ExerciseQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(-10, 11, [0, 1]);
  const b = randint(-10, 11, [0]);
  const c = randint(-10, 11, [0, a]);
  const d = randint(-10, 11, [0]);

  const affines = [new Affine(a, b), new Affine(c, d)];
  const solution = new Rational(d - b, a - c).simplify();

  const statementTree = new EqualNode(affines[0].toTree(), affines[1].toTree());
  const answerTree = new EqualNode(new VariableNode("x"), solution.toTree());
  const answer = answerTree.toTex();
  const statementTex = statementTree.toTex();
  const question: Question<Identifiers> = {
    instruction: `Résoudre : $${statementTex}$`,
    startStatement: statementTex,
    answer,
    keys: equationKeys,
    answerFormat: "tex",
    identifiers: {
      a: a,
      b: b,
      c: c,
      d: d,
    },
    //     hint: `Commence par regrouper les termes en $x$ d'un même côté de l'équation. Puis, isole $x$ en effectuant les bonnes opérations.`,
    //     correction: `On isole $x$ à gauche en soustrayant par $${b}$ puis en divisant par $${a}$ :

    // ${alignTex([
    //   [
    //     statementTex,
    //     "\\iff",
    //     new EqualNode(
    //       new Affine(a, 0).toTree(),
    //       affines[1].add(-b).toTree(),
    //     ).toTex(),
    //   ],
    //   ["", "\\iff", answer],
    // ])}

    //     `,
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
    const wrongAnswer = new Rational(
      d - b + randint(-7, 8, [0, -d + b]),
      a - c + randint(-7, 8, [-a + c, 0]),
    ).simplify();
    tryToAddWrongProp(
      propositions,
      new EqualNode(new VariableNode("x"), wrongAnswer.toTree()).toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c, d }) => {
  const solution = new Rational(d - b, a - c).simplify().toTree();
  const answerTree = new EquationSolutionNode(new DiscreteSetNode([solution]), {
    opts: { allowFractionToDecimal: true, allowRawRightChildAsSolution: true },
  });
  const validLatexs = answerTree.toAllValidTexs();
  return validLatexs.includes(ans);
};

export const equationType4Exercise: Exercise<Identifiers> = {
  id: "equa4",
  connector: "\\iff",
  label: "Équations $ax+b=cx+d$",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  sections: ["Équations"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getEquationType4ExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
