import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const frequencyTable: Exercise = {
  id: 'frequencyTable',
  connector: '=',
  instruction: '',
  label: "Calcul de la moyenne d'une série de valeurs",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Statistiques',
  generator: (nb: number) => getDistinctQuestions(getFrequencyTable, nb),
  keys: [],
};

export function getFrequencyTable(): Question {
  const getRandomUniqueValues = (count: number, min: number, max: number): number[] => {
    const uniqueValues: Set<number> = new Set();

    while (uniqueValues.size < count) {
      uniqueValues.add(randint(min, max));
    }

    return Array.from(uniqueValues).sort((a, b) => a - b);
  };

  const randomValeurs: number[] = getRandomUniqueValues(5, 1, 20);
  const randomEffectives = [1, 2, 3, 4, 5].map((el) => randint(1, 6));

  const sumEffectives = randomEffectives.reduce((sum, value) => sum + value, 0);
  let average = 0;

  for (let i = 0; i < randomValeurs.length; i++) average += randomValeurs[i] * randomEffectives[i];

  average /= sumEffectives;
  average = round(average, 2);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: average + '',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: round(average + randint(-average, 20 - average, [0]) + randint(1, 100) / 100, 2) + '',
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

Calculer la moyenne de cette série de valeurs.`,

    answer: average + '',
    keys: [],
    getPropositions,
  };

  return question;
}
