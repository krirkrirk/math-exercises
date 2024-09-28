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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { RationalFrac } from "#root/math/polynomials/rationalFrac";
import { randint } from "#root/math/utils/random/randint";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { LogNode } from "#root/tree/nodes/functions/logNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  a: number;
  b: number;
};

const getLnDerivative: QuestionGenerator<Identifiers> = () => {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);
  const polynom = new Polynomial([b, a]);
  const logTree = new LogNode(polynom.toTree());
  const answer = new RationalFrac(new Polynomial([a]), polynom)
    .simplify()
    .toTree()
    .toTex();
  const question: Question<Identifiers> = {
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${logTree.toTex()}$.`,
    startStatement: "f'(x)",
    answer,
    keys: ["x", "ln", "epower"],
    answerFormat: "tex",
    identifiers: { a, b },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const polynom = new Polynomial([b, a]);
  const logTree = new LogNode(polynom.toTree());

  tryToAddWrongProp(
    propositions,
    new MultiplyNode(new NumberNode(a), logTree).toTex(),
  );
  tryToAddWrongProp(propositions, a + "");
  tryToAddWrongProp(propositions, new ExpNode(polynom.toTree()).toTex());
  tryToAddWrongProp(propositions, polynom.toTree().toTex());
  tryToAddWrongProp(propositions, `\\frac{${a}}{${logTree.toTex()}}`);
  tryToAddWrongProp(propositions, `\\frac{1}{${polynom.toTree().toTex()}}`);

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b }) => {
  const frac = new RationalFrac(new Polynomial([a]), new Polynomial([b, a]));
  const nonSimplified = frac.toTree();
  const simplified = frac.simplify().toTree();
  const texs = [
    ...simplified.toAllValidTexs(),
    ...nonSimplified.toAllValidTexs(),
  ];
  return texs.includes(ans);
};

export const lnDerivativeOne: Exercise<Identifiers> = {
  id: "lnDerivativeOne",
  connector: "=",
  label: "Dérivée de $\\ln(ax + b)$",
  levels: ["1reESM", "1reSpé", "1reTech", "MathComp", "TermSpé"],
  sections: ["Dérivation", "Logarithme népérien"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getLnDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
