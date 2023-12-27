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
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { simplifyNode } from "#root/tree/parsers/simplify";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  answer: string;
  a: number;
  b: number;
};
type VEAProps = {
  a: number;
  b: number;
};

const getFirstDegreeEquation: QuestionGenerator<Identifiers> = () => {
  const a = randint(-30, 30, [0]);
  const b = randint(-30, 30, [0]);
  const answer = `x=${new Rational(a, b).simplify().toTree().toTex()}`;
  const question: Question<Identifiers> = {
    instruction: `Résoudre l'équation suivante : $\\frac{${a}}{x} = ${b}$`,
    startStatement: `x`,
    answer,
    keys: equationKeys,
    answerFormat: "tex",
    identifiers: { answer, a, b },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    `x=${simplifyNode(new NumberNode(b / a)).toTex()}`,
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      `x=${simplifyNode(
        new NumberNode((a + randint(-7, 8, [-a])) / (b + randint(-7, 8, [-b]))),
      ).toTex()}`,
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { a, b }) => {
  const solution = new Rational(a, b).simplify().toTree();
  const answerTree = new EquationSolutionNode(new DiscreteSetNode([solution]), {
    opts: { allowFractionToDecimal: true, allowRawRightChildAsSolution: true },
  });
  const validLatexs = answerTree.toAllValidTexs();
  return validLatexs.includes(ans);
};

export const firstDegreeEquation: MathExercise<Identifiers> = {
  id: "firstDegreeEquation",
  connector: "=",
  label: "Résoudre une équation du premier degré du type $\\frac{a}{x} = b$",
  levels: ["2nde", "1reESM", "1reSpé"],
  sections: ["Équations"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeEquation, nb),
  getPropositions,
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
};
