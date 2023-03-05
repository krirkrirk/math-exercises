import { Exercise, Question } from 'src/exercises/exercise';
import { getDistinctQuestions } from 'src/exercises/utils/getDistinctQuestions';
import { Integer } from 'src/math/numbers/integer/integer';
import { RationalConstructor } from 'src/math/numbers/rationals/rational';
import { randint } from 'src/math/utils/random/randint';
import { MultiplyNode } from 'src/tree/nodes/operators/multiplyNode';

export const fractionAndIntegerProduct: Exercise = {
  id: 'fractionAndIntegerProduct',
  connector: '=',
  instruction: 'Calculer la forme irréductible :',
  label: "Produit d'un entier et d'une fraction",
  levels: ['4', '3', '2', '1'],
  isSingleStep: false,
  section: 'Fractions',
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerProduct, nb),
};

export function getFractionAndIntegerProduct(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0]));
  const statementTree = new MultiplyNode(rational.toTree(), integer.toTree());
  statementTree.shuffle();

  const answerTree = rational.multiply(integer).toTree();
  const question: Question = {
    instruction: '',
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
  };
  return question;
}
