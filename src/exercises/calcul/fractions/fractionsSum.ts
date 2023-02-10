import { RationalConstructor } from '../../../numbers/rationals/rational';
import { AddNode } from '../../../tree/nodes/operators/addNode';
import { Exercise, Question } from '../../exercise';
import { getDistinctQuestions } from '../../utils/getDistinctQuestions';

export const fractionsSum: Exercise = {
  id: 'fractionsSum',
  connector: '=',
  instruction: 'Calculer la forme irréductible :',
  label: 'Sommes de fractions',
  levels: ['4', '3', '2', '1'],
  section: 'Fractions',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionsSum, nb),
};

export function getFractionsSum(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new AddNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.add(rational2).toTree();
  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
  };
  return question;
}
