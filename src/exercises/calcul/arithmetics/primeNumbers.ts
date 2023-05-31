import { randint } from '#root/math/utils/random/randint';
import { Exercise, Proposition, Question } from '../../exercise';
import { getDistinctQuestions } from '../../utils/getDistinctQuestions';

/**
 * a±b±c±d
 */
export const primeNumbers: Exercise = {
  id: 'primeNumbers',
  connector: '=',
  instruction: 'Donner la décomposition en nombre premiers',
  label: 'Décomposition en nombres premiers',
  levels: ['5', '4', '3', '2'],
  section: 'Arithmétiques',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getPrimeNumbers, nb),
  keys: [],
};

export function getPrimeNumbers(): Question {
  const primes = [2, 3, 5, 7, 11];
  const rand = randint(3, 5);
  let choosenNumebrs: number[] = [];

  let elevenCount = 0;

  for (let i = 0; i < rand; i++) {
    let temp = randint(0, 5);
    if (temp === 4) elevenCount++;
    while (elevenCount >= 2 && temp === 4) temp = randint(0, 5);
    choosenNumebrs.push(primes[temp]);
  }

  let prod = 1;

  for (let i = 0; i < choosenNumebrs.length; i++) prod *= choosenNumebrs[i];

  choosenNumebrs = choosenNumebrs.sort((a, b) => a - b);

  let answer = `${prod} = ${choosenNumebrs[0]}`;

  for (let i = 1; i < choosenNumebrs.length; i++) {
    answer += `\\times` + choosenNumebrs[i];
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    for (let i = 0; i < n; i++) {
      const wrongFactors = choosenNumebrs.slice(); // copier le tableau [...choosenNumbers]
      const randomIndex = randint(0, wrongFactors.length - 1);
      const wrongFactor = wrongFactors[randomIndex];

      // je remplace les nombres premiers pour générer les fausses réponses
      let newFactor = wrongFactor;
      while (newFactor === wrongFactor) {
        const temp = randint(0, primes.length - 1);
        newFactor = primes[temp];
      }

      wrongFactors[randomIndex] = newFactor;

      let wrongAnswer = `${prod} = ${wrongFactors[0]}`;
      for (let j = 1; j < wrongFactors.length; j++) {
        wrongAnswer += `\\times` + wrongFactors[j];
      }

      res.push({
        id: Math.random() + '',
        statement: wrongAnswer,
        isRightAnswer: false,
      });
    }
    return res;
  };

  const question: Question = {
    startStatement: `${prod} = ?`,
    answer,
    keys: [],
    getPropositions,
  };
  return question;
}
