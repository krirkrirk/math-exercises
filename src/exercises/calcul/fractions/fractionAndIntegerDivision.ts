import { Exercise, Question } from 'src/exercises/exercise';
import { getDistinctQuestions } from 'src/exercises/utils/getDistinctQuestions';
import { Integer } from 'src/math/numbers/integer/integer';
import { RationalConstructor } from 'src/math/numbers/rationals/rational';
import { randint } from 'src/math/utils/random/randint';
import { DivideNode } from 'src/tree/nodes/operators/divideNode';
import { coinFlip } from 'src/utils/coinFlip';

export const fractionAndIntegerDivision: Exercise = {
  id: 'fractionAndIntegerDivision',
  connector: '=',
  instruction: 'Calculer la forme irréductible :',
  label: "Division d'un entier et d'une fraction",
  levels: ['4', '3', '2', '1'],
  isSingleStep: false,
  section: 'Fractions',
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerDivision, nb),
};

export function getFractionAndIntegerDivision(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0]));

  const integerFirst = coinFlip();
  const statementTree = integerFirst
    ? new DivideNode(integer.toTree(), rational.toTree())
    : new DivideNode(rational.toTree(), integer.toTree());

  const answerTree = integerFirst ? integer.divide(rational).toTree() : rational.divide(integer).toTree();
  const question: Question = {
    instruction: '',
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
  };
  return question;
}
