import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  addWrongProp,
  shuffleProps,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Rational, RationalConstructor } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { DivideNode } from '#root/tree/nodes/operators/divideNode';
import { coinFlip } from '#root/utils/coinFlip';

const getFractionAndIntegerDivision: QuestionGenerator<QCMProps> = () => {
  const rational = RationalConstructor.randomIrreductible();
  const integerFirst = coinFlip();
  const integer = integerFirst ? new Integer(randint(-10, 11, [0])) : new Integer(randint(-10, 11, [0, 1]));

  const statementTree = integerFirst
    ? new DivideNode(integer.toTree(), rational.toTree())
    : new DivideNode(rational.toTree(), integer.toTree());
  const answerTree = integerFirst ? integer.divide(rational).toTree() : rational.divide(integer).toTree();
  const answerTex = answerTree.toTex();
  const question: Question<QCMProps> = {
    instruction: `Calculer et donner le résultat sous la forme d'une fraction irréductible : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer: answerTex,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: {
      answer: answerTex,
      integerFirst,
      integer: integer.value,
      rational: [rational.num, rational.denum],
    },
  };
  return question;
};

type QCMProps = {
  answer: string;
  integerFirst: boolean;
  integer: number;
  rational: [number, number];
};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer, integerFirst, integer, rational }) => {
  const res: Proposition[] = [];
  addValidProp(res, answer);
  const integerObj = new Integer(integer);
  const rationalObj = new Rational(rational[0], rational[1]);
  addWrongProp(
    res,
    !integerFirst ? integerObj.divide(rationalObj).toTree().toTex() : rationalObj.divide(integerObj).toTree().toTex(),
  );

  while (res.length < n) {
    const wrongRational = RationalConstructor.randomIrreductible();
    const wrongAnswerTree = integerFirst
      ? integerObj.divide(wrongRational).toTree()
      : wrongRational.divide(integerObj).toTree();
    tryToAddWrongProp(res, wrongAnswerTree.toTex());
  }

  return shuffleProps(res, n);
};

export const fractionAndIntegerDivision: MathExercise = {
  id: 'fractionAndIntegerDivision',
  connector: '=',
  label: "Division d'un entier et d'une fraction",
  levels: ['4ème', '3ème', '2nde', '2ndPro', '1rePro', 'CAP'],
  isSingleStep: false,
  sections: ['Fractions'],
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerDivision, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
