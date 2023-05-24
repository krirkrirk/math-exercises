import { randint } from '#root/math/utils/random/randint';
import { Exercise, Question } from '../../exercise';
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
  let choosenNumebrs = [];

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

  const question: Question = {
    startStatement: `${prod} = ?`,
    answer,
    keys: [],
  };
  return question;
}
