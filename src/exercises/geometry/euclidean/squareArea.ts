import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const squareArea: MathExercise = {
  id: 'squareArea',
  connector: '=',
  instruction: '',
  label: "Calculer l'aire d'un carré",
  levels: ['4ème', '3ème', '2nde'],
  isSingleStep: false,
  sections: ['Géométrie euclidienne'],
  generator: (nb: number) => getDistinctQuestions(getSquareArea, nb, 20),
  qcmTimer: 60,
  freeTimer: 60,
  maxAllowedQuestions: 20,
};

export function getSquareArea(): Question {
  const side = randint(1, 21);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: side ** 2 + '',
      isRightAnswer: true,
      format: 'tex',
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: randint(1, 13) ** 2 + '',
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Calculer l'aire d'un carré de $${side}$ cm de côté.`,
    answer: side ** 2 + '',
    getPropositions,
    answerFormat: 'tex',
    keys: [],
  };

  return question;
}
