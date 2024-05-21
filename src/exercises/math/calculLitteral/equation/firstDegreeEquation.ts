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
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
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
    identifiers: { a, b },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    `x=${new Rational(b, a).simplify().toTree().toTex()}`,
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      `x=${new Rational(a + randint(-7, 8, [-a]), b + randint(-7, 8, [-b]))
        .simplify()
        .toTree()
        .toTex()}`,
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

export const firstDegreeEquation: Exercise<Identifiers> = {
  id: "firstDegreeEquation",
  connector: "=",
  label: "Résoudre une équation du type $\\frac{a}{x} = b$",
  levels: ["2nde", "1reESM", "1reSpé"],
  sections: ["Équations", "Fonction inverse", "Fonctions de référence"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeEquation, nb),
  getPropositions,
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
  subject: "Mathématiques",
};
