import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const medianList: Exercise = {
  id: 'medianList',
  connector: '=',
  instruction: '',
  label: "Calcul de la médiane d'une liste de valeurs",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Probabilités',
  generator: (nb: number) => getDistinctQuestions(getMedian, nb),
  keys: ['f', 'cap', 'underscore'],
};

export function getMedian(): Question {
  let randomValeurs: number[] = [];
  const length = randint(6, 10);

  for (let i = 0; i < length; i++) randomValeurs.push(randint(1, 20));

  const sortedValues = randomValeurs.sort((a, b) => a - b);

  const middleIndex = Math.floor(randomValeurs.length / 2);

  let median: number;

  if (randomValeurs.length % 2 === 0) {
    median = (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
  } else {
    median = sortedValues[middleIndex];
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: median + '',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: randomValeurs[randint(0, randomValeurs.length)] + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `On considère la liste suivante : $${randomValeurs.join(';\\ ')}.$
    $\\\\$Calculer la médiane de cette liste de valeurs.`,

    answer: median + '',
    keys: ['f', 'cap', 'underscore'],
    getPropositions,
  };

  return question;
}
