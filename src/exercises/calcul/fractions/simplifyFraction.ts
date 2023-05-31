import { Exercise, Proposition, Question } from '#root/exercises/exercise';
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

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];
    for (let i = 0; i < n; i++) {
      const incorrectRational = RationalConstructor.randomSimplifiable(10);
      propositions.push({
        id: Math.random() + '',
        statement: incorrectRational.toTree().toTex(),
        isRightAnswer: false,
      });
    }
    return propositions;
  };

  const question: Question = {
    startStatement: rational.toTree().toTex(),
    answer: rational.simplify().toTree().toTex(),
    keys: [],
    getPropositions,
  };
  return question;
}
