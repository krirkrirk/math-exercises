import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Rational } from "#root/math/numbers/rationals/rational";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";

type Identifiers = {
  a: number;
  b: number;
  c: number;
};
const getSummitAbscissFromRootsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const trinom = TrinomConstructor.randomNiceRoots(2);
  const roots = trinom.getRoots();
  console.log("roots", roots);
  const answer = new Rational(roots[0] + roots[1], 2)
    .simplify()
    .toTree()
    .toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $f(x) = ax^2+bx+c$ une fonction polynôme du second degé, dont les racines sont $${roots[0]}$ et $${roots[1]}$. Quelle est l'abscisse du sommet de la parabole représentant $f$ ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const roots = new Trinom(a, b, c).getRoots();
  tryToAddWrongProp(propositions, roots[0] + roots[1] + "");
  tryToAddWrongProp(
    propositions,
    new Rational(roots[0] - roots[1], 2).simplify().toTree().toTex(),
  );

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 11) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, a, b, c }) => {
  const trinom = new Trinom(a, b, c);
  console.log(ans, answer);
  const node = trinom.getAlphaNode();
  const texs = node.toAllValidTexs({
    allowFractionToDecimal: true,
    allowMinusAnywhereInFraction: true,
  });
  return texs.includes(ans);
};
export const summitAbscissFromRoots: Exercise<Identifiers> = {
  id: "summitAbscissFromRoots",
  connector: "=",
  label:
    "Déterminer l'abscisse du sommet d'une parabole en connaissant ses racines",
  levels: ["1reSpé", "1rePro", "1reTech"],
  isSingleStep: true,
  sections: ["Second degré"],
  generator: (nb: number) =>
    getDistinctQuestions(getSummitAbscissFromRootsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
