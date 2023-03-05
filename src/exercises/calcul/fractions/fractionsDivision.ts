import { Exercise, Question } from 'src/exercises/exercise';
import { getDistinctQuestions } from 'src/exercises/utils/getDistinctQuestions';
import { RationalConstructor } from 'src/math/numbers/rationals/rational';
import { DivideNode } from 'src/tree/nodes/operators/divideNode';

export const fractionsDivision: Exercise = {
  id: 'fractionsDivision',
  connector: '=',
  instruction: 'Calculer la forme irréductible :',
  label: 'Divisions de fractions',
  levels: ['4', '3', '2', '1'],
  section: 'Fractions',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionsDivision, nb),
};

export function getFractionsDivision(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new DivideNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.divide(rational2).toTree();
  const question: Question = {
    instruction: '',
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
  };
  return question;
}
