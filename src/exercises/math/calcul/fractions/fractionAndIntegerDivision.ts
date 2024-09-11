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
import { Integer } from "#root/math/numbers/integer/integer";
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { DivideNode } from "#root/tree/nodes/operators/divideNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/coinFlip";

const getFractionAndIntegerDivision: QuestionGenerator<Identifiers> = () => {
  const rational = RationalConstructor.randomIrreductible();
  const integerFirst = coinFlip();
  const integer = integerFirst
    ? new Integer(randint(-10, 11, [0]))
    : new Integer(randint(-10, 11, [0, 1]));

  const statementTree = integerFirst
    ? new DivideNode(integer.toTree(), rational.toTree())
    : new DivideNode(rational.toTree(), integer.toTree());
  const answerTree = integerFirst
    ? integer.divide(rational).toTree()
    : rational.divide(integer).toTree();
  const answerTex = answerTree.toTex();
  const beforeSimplification = integerFirst
    ? new Rational(integer.value * rational.denum, rational.num)
    : new Rational(rational.num, rational.denum * integer.value);
  const question: Question<Identifiers> = {
    instruction: `Calculer et donner le résultat sous la forme d'une fraction irréductible : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer: answerTex,
    keys: [],
    hint: "Pour diviser une fraction par un nombre entier, on peut écrire le nombre entier sous forme de fraction. Puis, on multiplie la première fraction par l'inverse de la seconde. Enfin, on simplife la fraction obtenue si possible.",
    correction: `
On écrit $${integer.value}$ sous forme de fraction : 

$${integer.value} = \\frac{${integer.value}}{1}$

On multiplie la première fraction par l'inverse de la seconde :

${
  integerFirst
    ? `$\\frac{${integer.value}}{1}\\div ${rational
        .toTree()
        .toTex()} = \\frac{${integer.value}}{1} \\times ${rational
        .reverse(false)
        .toTree()
        .toTex()} = \\frac{${new MultiplyNode(
        integer.toTree(),
        rational.denum.toTree(),
      ).toTex({ forceNoSimplification: true })}}{${new MultiplyNode(
        (1).toTree(),
        rational.num.toTree(),
      ).toTex({ forceNoSimplification: true })}}
    = ${beforeSimplification.toTree().toTex()}$`
    : `$${rational.toTree().toTex()}\\div \\frac{${
        integer.value
      }}{1} = ${rational.toTree().toTex()}\\times \\frac{1}{${
        integer.value
      }} = \\frac{${rational.num}\\times 1}{${new MultiplyNode(
        rational.denum.toTree(),
        integer.toTree(),
      ).toTex({ forceNoSimplification: true })}} = ${beforeSimplification
        .toTree()
        .toTex()}$`
}

${
  !beforeSimplification.isIrreductible()
    ? `On peut alors simplifier cette fraction : 
  
$${beforeSimplification.toTree().toTex()} = ${answerTex}$
  `
    : "Cette fraction est déjà irréductible."
}

Ainsi, le résultat attendu est $${answerTex}$.
    `,
    answerFormat: "tex",
    identifiers: {
      integerFirst,
      integer: integer.value,
      rational: [rational.num, rational.denum],
    },
  };
  return question;
};

type Identifiers = {
  integerFirst: boolean;
  integer: number;
  rational: [number, number];
};
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, integerFirst, integer, rational },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const integerObj = new Integer(integer);
  const rationalObj = new Rational(rational[0], rational[1]);
  tryToAddWrongProp(
    propositions,
    !integerFirst
      ? integerObj.divide(rationalObj).toTree().toTex()
      : rationalObj.divide(integerObj).toTree().toTex(),
  );

  while (propositions.length < n) {
    const wrongRational = RationalConstructor.randomIrreductible();
    const wrongAnswerTree = integerFirst
      ? integerObj.divide(wrongRational).toTree()
      : wrongRational.divide(integerObj).toTree();
    tryToAddWrongProp(propositions, wrongAnswerTree.toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { integer, integerFirst, rational },
) => {
  const integerObj = new Integer(integer);
  const rationalObj = new Rational(rational[0], rational[1]);
  const answerTree = integerFirst
    ? integerObj.divide(rationalObj).toTree({ allowFractionToDecimal: true })
    : rationalObj.divide(integerObj).toTree({ allowFractionToDecimal: true });
  const texs = answerTree.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const fractionAndIntegerDivision: Exercise<Identifiers> = {
  id: "fractionAndIntegerDivision",
  connector: "=",
  label: "Division d'un entier et d'une fraction",
  levels: ["4ème", "3ème", "2nde", "2ndPro", "1rePro", "CAP"],
  isSingleStep: false,
  sections: ["Fractions"],
  generator: (nb: number) =>
    getDistinctQuestions(getFractionAndIntegerDivision, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
