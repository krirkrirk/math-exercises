import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const triangleAreaV2: Exercise = {
  id: 'triangleAreaV2',
  connector: '=',
  instruction: '',
  label: "Calculer l'aire d'un triangle (sans figure)",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getTriangleAreaV2, nb),
};

export function getTriangleAreaV2(): Question {
  const sides = [
    [3, 4, 5],
    [5, 12, 13],
    [8, 15, 17],
    [7, 24, 25],
    [20, 21, 29],
    [12, 35, 37],
    [9, 40, 41],
    [28, 45, 53],
    [11, 60, 61],
    [16, 63, 65],
    [33, 56, 65],
    [48, 55, 73],
    [13, 84, 85],
    [36, 77, 85],
    [39, 80, 89],
    [65, 72, 97],
  ];

  const randomSide = randint(0, sides.length);
  const area = (sides[randomSide][0] * sides[randomSide][1]) / 2;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: area + '',
      isRightAnswer: true,
    });

    res.push({
      id: v4() + '',
      statement: sides[randomSide][0] + sides[randomSide][1] + sides[randomSide][2] + '',
      isRightAnswer: false,
    });

    for (let i = 0; i < n - 2; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: area + randint(-area + 1, 14, [0]) + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Calculer l'aire du triangle rectangle qui a pour côtés: $${sides[randomSide][0]}$ cm, $${sides[randomSide][1]}$ cm et $${sides[randomSide][2]}$ cm.`,
    answer: area + '',
    getPropositions,
  };

  return question;
}
