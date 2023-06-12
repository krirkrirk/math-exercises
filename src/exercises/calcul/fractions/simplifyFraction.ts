import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';
import { shuffle } from '#root/utils/shuffle';
import { v4 as uuidv4 } from 'uuid';

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

    propositions.push({
      id: uuidv4(),
      statement: rational.simplify().toTree().toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const incorrectRational = RationalConstructor.randomSimplifiable(10);
        proposition = {
          id: uuidv4(),
          statement: incorrectRational.toTree().toTex(),
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    startStatement: rational.toTree().toTex(),
    answer: rational.simplify().toTree().toTex(),
    keys: [],
    getPropositions,
  };
  return question;
}
