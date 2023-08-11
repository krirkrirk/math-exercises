import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const rectanglePerimeter: Exercise = {
  id: 'rectanglePerimeter',
  connector: '=',
  instruction: '',
  label: "Calculer le périmètre d'un rectangle",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getRectanglePerimeter, nb),
};

export function getRectanglePerimeter(): Question {
  const length = randint(3, 13);
  const width = randint(1, length);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: (length + width) * 2 + '',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: (randint(3, 13) + randint(1, 13)) * 2 + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Calculer le périmètre d'un rectangle de $${length}$ cm de longueur et de $${width}$ cm de largeur.`,
    answer: (length + width) * 2 + '',
    getPropositions,
  };

  return question;
}
