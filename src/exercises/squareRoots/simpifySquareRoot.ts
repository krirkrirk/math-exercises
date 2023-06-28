import { SquareRootConstructor } from '#root/math/numbers/reals/squareRoot';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const simplifySquareRoot: Exercise = {
  id: 'simplifySqrt',
  connector: '=',
  instruction: 'Simplifier :',
  label: 'Simplification de racines carrées',
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Racines carrées',
  generator: (nb: number) => getDistinctQuestions(getSimplifySquareRoot, nb),
  keys: [],
};

export function getSimplifySquareRoot(): Question {
  const squareRoot = SquareRootConstructor.randomSimplifiable({
    allowPerfectSquare: false,
    maxSquare: 11,
  });

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: squareRoot.simplify().toTree().toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const squareRoot = SquareRootConstructor.randomSimplifiable({
          allowPerfectSquare: false,
          maxSquare: 11,
        });

        proposition = {
          id: v4() + '',
          statement: squareRoot.simplify().toTree().toTex(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    startStatement: squareRoot.toTree().toTex(),
    answer: squareRoot.simplify().toTree().toTex(),
    keys: [],
    getPropositions,
  };
  return question;
}
