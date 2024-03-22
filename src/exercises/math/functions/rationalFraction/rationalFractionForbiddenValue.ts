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
import { Affine } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  a: number;
  b: number;
  c: number;
  d: number;
};

const getRationalFractionForbiddenValueQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = randint(-10, 11, [0]);
  const b = randint(-10, 11);
  //pour éviter affine2 = k*affine1
  let c: number, d: number;
  do {
    c = randint(-10, 11, [0]);
    d = randint(-10, 11);
  } while (a * d - b * c === 0);

  const affine1 = new Affine(a, b);
  const affine2 = new Affine(c, d);
  const fct = new FractionNode(affine1.toTree(), affine2.toTree());
  const fctTex = fct.toTex();
  const answerTree = new Rational(-d, c).simplify().toTree();
  const answer = answerTree.toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $f(x)=${fctTex}$. Quelle est la valeur interdite de la fonction $f$ ?`,
    keys: [],
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
    new Rational(-b, a).simplify().toTree().toTex(),
  );
  tryToAddWrongProp(propositions, d + "");
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 11) + "");
  }
  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { c, d }) => {
  const answerTree = new Rational(-d, c)
    .simplify()
    .toTree({ allowFractionToDecimal: true });
  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};
export const rationalFractionForbiddenValue: Exercise<Identifiers> = {
  id: "rationalFractionForbiddenValue",
  connector: "=",
  label: "Déterminer la valeur interdite d'un quotient de polynôme",
  levels: ["2nde", "1reESM", "1reSpé"],
  isSingleStep: true,
  sections: ["Fonctions", "Fractions"],
  generator: (nb: number) =>
    getDistinctQuestions(getRationalFractionForbiddenValueQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
