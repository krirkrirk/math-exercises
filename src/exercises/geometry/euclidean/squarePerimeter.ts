import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const squarePerimeter: Exercise = {
  id: 'squarePerimeter',
  connector: '=',
  instruction: '',
  label: "Calculer le périmètre d'un carré",
  levels: ['4ème', '3ème', '2nde'],
  isSingleStep: false,
  sections: ['Géométrie euclidienne'],
  generator: (nb: number) => getDistinctQuestions(getSquarePerimeter, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getSquarePerimeter(): Question {
  const side = randint(1, 13);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: side * 4 + '',
      isRightAnswer: true,
      format: 'tex',
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: side * 4 + randint(-side * 4 + 1, 14, [0]) + '',
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
    instruction: `Calculer le périmètre d'un carré de $${side}$ cm de côté.`,
    answer: side * 4 + '',
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
