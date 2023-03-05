import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';

export const fractionsProduct: Exercise = {
  id: 'fractionsProduct',
  connector: '=',
  instruction: 'Calculer la forme irréductible :',
  label: 'Produits de fractions',
  levels: ['4', '3', '2', '1'],
  section: 'Fractions',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionsProduct, nb),
};

export function getFractionsProduct(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new MultiplyNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.multiply(rational2).toTree();
  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
  };
  return question;
}
