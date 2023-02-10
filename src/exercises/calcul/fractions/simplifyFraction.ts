import { RationalConstructor } from '../../../numbers/rationals/rational';
import { Exercise, Question } from '../../exercise';
import { getDistinctQuestions } from '../../utils/getDistinctQuestions';

export const simplifyFraction: Exercise = {
  id: 'simplifyFrac',
  connector: '=',
  instruction: 'Simplifier :',
  label: 'Simplification de fractions',
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Fractions',
  generator: (nb: number) => getDistinctQuestions(getSimplifyFraction, nb),
};

export function getSimplifyFraction(): Question {
  const rational = RationalConstructor.randomSimplifiable(10);
  const question: Question = {
    startStatement: rational.toTree().toTex(),
    answer: rational.simplify().toTree().toTex(),
  };
  return question;
}
