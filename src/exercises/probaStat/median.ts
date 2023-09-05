import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const median: Exercise = {
  id: 'median',
  connector: '=',
  instruction: '',
  label: "Calcul de la moyenne d'une série de valeurs",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Probabilités',
  generator: (nb: number) => getDistinctQuestions(getMedian, nb),
  keys: [],
};

export function getMedian(): Question {
  const getRandomUniqueValues = (count: number, min: number, max: number): number[] => {
    const uniqueValues: Set<number> = new Set();

    while (uniqueValues.size < count) {
      uniqueValues.add(randint(min, max));
    }

    return Array.from(uniqueValues).sort((a, b) => a - b);
  };

  const randomValeurs: number[] = getRandomUniqueValues(5, 1, 20);
  const randomEffectives = [1, 2, 3, 4, 5].map((el) => randint(1, 6));

  let sortedValues: number[] = [];

  for (let i = 0; i < randomEffectives.length; i++)
    for (let j = 0; j < randomEffectives[i]; j++) sortedValues.push(randomValeurs[i]);

  const n = randomEffectives.reduce((sum, value) => sum + value, 0);
  const middleIndex = Math.floor(n / 2);

  let median: number;

  if (n % 2 === 0) {
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
    instruction: `On considère le tableau d'effectifs suivant : 

| | | | | | |
|-|-|-|-|-|-|
|Valeur|${randomValeurs[0]}|${randomValeurs[1]}|${randomValeurs[2]}|${randomValeurs[3]}|${randomValeurs[4]}|
|Effectif|${randomEffectives[0]}|${randomEffectives[1]}|${randomEffectives[2]}|${randomEffectives[3]}|${randomEffectives[4]}|

Calculer la médiane de cette série de valeurs.`,

    answer: median + '',
    keys: [],
    getPropositions,
  };

  return question;
}
