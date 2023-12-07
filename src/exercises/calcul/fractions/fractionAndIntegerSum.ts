import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  addWrongProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Rational, RationalConstructor } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

const getFractionAndIntegerSum: QuestionGenerator<QCMProps> = () => {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0]));
  const statementTree = new AddNode(rational.toTree(), integer.toTree());
  statementTree.shuffle();
  const answerTree = rational.add(integer).toTree();
  const question: Question = {
    instruction: `Calculer et donner le résultat sous la forme d'une fraction irréductible : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: [],
    answerFormat: 'tex',
  };
  return question;
};

type QCMProps = {
  answer: string;
  integer: number;
  rational: [number, number];
};
const getPropositions: QCMGenerator<QCMProps> = (n: number, { answer, integer, rational }) => {
  const res: Proposition[] = [];
  addValidProp(res, answer);
  const integerObj = new Integer(integer);
  const rationalObj = new Rational(rational[0], rational[1]);
  addWrongProp(res, new Rational(integerObj.value + rationalObj.num, rationalObj.denum).toTex());

  if (integerObj.value + rationalObj.denum !== 0)
    addWrongProp(res, new Rational(integerObj.value + rationalObj.num, integerObj.value + rationalObj.denum).toTex());

  while (res.length < n) {
    const rational = RationalConstructor.randomIrreductible();
    const wrongAnswerTree = rational.add(integerObj).toTree();
    tryToAddWrongProp(res, wrongAnswerTree.toTex());
  }

  return shuffle(res);
};

export const fractionAndIntegerSum: MathExercise = {
  id: 'fractionAndIntegerSum',
  connector: '=',
  label: "Somme d'un entier et d'une fraction",
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1rePro'],
  isSingleStep: false,
  sections: ['Fractions'],
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerSum, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
