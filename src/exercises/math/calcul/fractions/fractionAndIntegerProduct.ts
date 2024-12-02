import {
  Exercise,
  GetAnswer,
  GetCorrection,
  GetHint,
  GetInstruction,
  GetStartStatement,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { allowNonIrreductibleOption } from "#root/exercises/options/allowNonIrreductibleFractions";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Integer } from "#root/math/numbers/integer/integer";
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { frac } from "#root/tree/nodes/operators/fractionNode";
import {
  MultiplyNode,
  multiply,
} from "#root/tree/nodes/operators/multiplyNode";
import { rationalParser } from "#root/tree/parsers/rationalParser";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  integer: number;
  rational: number[];
  integerFirst: boolean;
};

type Options = {
  allowNonIrreductible?: boolean;
};

const options = [allowNonIrreductibleOption];

const getStatement = (identifiers: Identifiers) => {
  const { integer, rational, integerFirst } = identifiers;
  const fraction = frac(rational[0], rational[1]);
  const statementTree = integerFirst
    ? multiply(integer, fraction)
    : multiply(fraction, integer);
  return statementTree;
};
const getInstruction: GetInstruction<Identifiers, Options> = (
  identifiers,
  opts,
) => {
  const statementTree = getStatement(identifiers);

  return `Calculer ${
    opts?.allowNonIrreductible
      ? ""
      : "et donner le résultat sous la forme la plus simplifiée possible"
  } : 
    
$$
${statementTree.toTex()}
$$`;
};

const getStartStatement: GetStartStatement<Identifiers> = (identifiers) => {
  const statementTree = getStatement(identifiers);
  return statementTree.toTex();
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const statementTree = getStatement(identifiers);
  return statementTree.simplify().toTex();
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return "Pour multiplier une fraction par un nombre entier, on multiplie le numérateur de la fraction par le nombre entier, sans toucher au dénominateur. On simplifie ensuite la fraction obtenue si possible.";
};

const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const { integer, rational } = identifiers;
  const answer = getAnswer(identifiers);
  const statementTree = getStatement(identifiers);
  const beforeSimplification = new Rational(rational[0] * integer, rational[1]);
  return `
On multiplie le numérateur de la fraction par le nombre entier : 

$$
${statementTree.toTex()} = \\frac{${new MultiplyNode(
    rational[0].toTree(),
    integer.toTree(),
  ).toTex({ forceNoSimplification: true })}}{${
    rational[1]
  }} = ${beforeSimplification.toTree().toTex()}
$$

${
  !beforeSimplification.isIrreductible()
    ? `On peut alors simplifier cette fraction : 
  
$$
${beforeSimplification.toTree().toTex()} = ${answer}
$$
  `
    : "Cette fraction est déjà simplifiée."
}

Ainsi, le résultat attendu est $${answer}$.
    `;
};
const getFractionAndIntegerProduct: QuestionGenerator<Identifiers, Options> = (
  opts,
) => {
  const rational = RationalConstructor.randomIrreductible();
  const integer = randint(-10, 11, [-1, 0, 1]);
  const integerFirst = coinFlip();
  const identifiers = {
    integer,
    rational: [rational.num, rational.denum],
    integerFirst,
  };
  const question: Question<Identifiers, Options> = {
    instruction: getInstruction(identifiers, opts),
    startStatement: getStartStatement(identifiers),
    answer: getAnswer(identifiers),
    keys: [],
    answerFormat: "tex",
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
    identifiers,
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, integer, rational },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    frac(integer * rational[0], integer * rational[1]).toTex(),
  );
  while (propositions.length < n) {
    const randomMultiplier = randint(-10, 10);
    const wrongAnswerTree = multiply(
      frac(rational[0], rational[1]),
      randomMultiplier,
    ).simplify();
    tryToAddWrongProp(propositions, wrongAnswerTree.toTex());
  }
  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers, Options> = (
  ans,
  { integer, rational, integerFirst, answer },
  opts,
) => {
  const answerTree = getStatement({
    integer,
    rational,
    integerFirst,
  }).simplify();
  const texs = answerTree.toAllValidTexs({ allowFractionToDecimal: true });
  if (opts?.allowNonIrreductible) {
    const parsed = rationalParser(ans);
    if (!parsed) return false;
    return texs.includes(parsed.simplify().toTex());
  } else {
    return texs.includes(ans);
  }
};

export const fractionAndIntegerProduct: Exercise<Identifiers, Options> = {
  id: "fractionAndIntegerProduct",
  connector: "=",
  label: "Produit d'un entier et d'une fraction",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro"],
  isSingleStep: false,
  sections: ["Fractions"],
  generator: (nb, opts) =>
    getDistinctQuestions(() => getFractionAndIntegerProduct(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasHintAndCorrection: true,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getInstruction,
  getAnswer,
  getStartStatement,
  options,
};
