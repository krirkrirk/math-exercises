import {
  Exercise,
  GetAnswer,
  GetCorrection,
  GetHint,
  GetInstruction,
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
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  integerFirst: boolean;
  integer: number;
  rational: number[];
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const { integerFirst, integer, rational } = identifiers;
  const rationalObj = new Rational(rational[0], rational[1]);
  const integerObj = new Integer(integer);
  const answerTree = integerFirst
    ? integerObj.divide(rationalObj).toTree()
    : rationalObj.divide(integerObj).toTree();
  const answerTex = answerTree.toTex();
  return answerTex;
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const { integerFirst, integer, rational } = identifiers;
  const rationalObj = new Rational(rational[0], rational[1]);
  const statementTree = integerFirst
    ? new DivideNode(integer.toTree(), rationalObj.toTree())
    : new DivideNode(rationalObj.toTree(), integer.toTree());

  return `Calculer et simplifier au maximum : 
    
$$
${statementTree.toTex()}
$$`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return "Pour diviser une fraction par un nombre entier, on peut écrire le nombre entier sous forme de fraction. Puis, on multiplie la première fraction par l'inverse de la seconde. Enfin, on simplife la fraction obtenue si possible.";
};

const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const { integerFirst, integer, rational } = identifiers;
  const rationalObj = new Rational(rational[0], rational[1]);
  const beforeSimplification = integerFirst
    ? new Rational(integer * rationalObj.denum, rationalObj.num)
    : new Rational(rationalObj.num, rationalObj.denum * integer);
  const answerTex = getAnswer(identifiers);
  return `
On écrit $${integer}$ sous forme de fraction : 

$$
${integer} = \\frac{${integer}}{1}
$$

On multiplie la première fraction par l'inverse de la seconde :

$$
${
  integerFirst
    ? `\\frac{${integer}}{1}\\div ${rationalObj
        .toTree()
        .toTex()} = \\frac{${integer}}{1} \\times ${rationalObj
        .reverse(false)
        .toTree()
        .toTex()} = \\frac{${new MultiplyNode(
        integer.toTree(),
        rationalObj.denum.toTree(),
      ).toTex({ forceNoSimplification: true })}}{${new MultiplyNode(
        (1).toTree(),
        rationalObj.num.toTree(),
      ).toTex({ forceNoSimplification: true })}}
    = ${beforeSimplification.toTree().toTex()}`
    : `${rationalObj
        .toTree()
        .toTex()}\\div \\frac{${integer}}{1} = ${rationalObj
        .toTree()
        .toTex()}\\times \\frac{1}{${integer}} = \\frac{${
        rationalObj.num
      }\\times 1}{${new MultiplyNode(
        rationalObj.denum.toTree(),
        integer.toTree(),
      ).toTex({ forceNoSimplification: true })}} = ${beforeSimplification
        .toTree()
        .toTex()}`
}
$$

${
  !beforeSimplification.isIrreductible()
    ? `On peut alors simplifier cette fraction : 
  
$$
${beforeSimplification.toTree().toTex()} = ${answerTex}
$$
  `
    : "Cette fraction est déjà simplifiée."
}

Ainsi, le résultat attendu est $${answerTex}$.
    `;
};
const getFractionAndIntegerDivision: QuestionGenerator<Identifiers> = () => {
  const rational = RationalConstructor.randomIrreductible();
  const integerFirst = coinFlip();
  const integer = integerFirst
    ? new Integer(randint(-10, 11, [0]))
    : new Integer(randint(-10, 11, [0, 1]));

  const statementTree = integerFirst
    ? new DivideNode(integer.toTree(), rational.toTree())
    : new DivideNode(rational.toTree(), integer.toTree());

  const identifiers = {
    integerFirst,
    integer: integer.value,
    rational: [rational.num, rational.denum],
  };

  const question: Question<Identifiers> = {
    instruction: getInstruction(identifiers),
    startStatement: statementTree.toTex(),
    answer: getAnswer(identifiers),
    keys: [],
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
    answerFormat: "tex",
    identifiers,
  };
  return question;
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
  getAnswer,
  getInstruction,
  getHint,
  getCorrection,
};
