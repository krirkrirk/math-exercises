import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';

export const simplifyFraction: Exercise = {
  id: 'simplifyFrac',
  connector: '=',
  instruction: 'Simplifier :',
  label: 'Simplification de fractions',
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Fractions',
  generator: (nb: number) => getDistinctQuestions(getSimplifyFraction, nb),
  keys: [],
};

export function getSimplifyFraction(): Question {
  const rational = RationalConstructor.randomSimplifiable(10);
  const question: Question = {
    startStatement: rational.toTree().toTex(),
    answer: rational.simplify().toTree().toTex(),
    keys: [],
  };
  return question;
}
