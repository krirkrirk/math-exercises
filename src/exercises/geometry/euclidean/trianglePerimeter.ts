import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const trianglePerimeter: Exercise = {
  id: 'trianglePerimeter',
  connector: '=',
  instruction: '',
  label: "Calculer le périmètre d'un triangle",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getTrianglePerimeter, nb),
};

export function getTrianglePerimeter(): Question {
  const sides = [randint(1, 13), randint(1, 13), randint(1, 13)];
  const perimeter = sides[0] + sides[1] + sides[2];

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: perimeter + '',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: perimeter + randint(-perimeter + 1, 14, [0]) + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Calculer le périmètre d'un triangle qui a pour côtés: $${sides[0]}$ cm, $${sides[1]}$ cm et $${sides[2]}$ cm.`,
    answer: sides[0] + sides[1] + sides[2] + '',
    getPropositions,
  };

  return question;
}
