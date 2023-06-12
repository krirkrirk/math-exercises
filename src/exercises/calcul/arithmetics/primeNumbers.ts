import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';
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

function prodNumbers(tab: number[]) {
  let temp = 1;
  for (let i = 0; i < tab.length; i++) temp *= tab[i];
  return temp;
}

export function getPrimeNumbers(): Question {
  const primes = [2, 3, 5, 7, 11];
  const rand = randint(3, 5);
  let choosenNumbers: number[] = [];

  let elevenCount = 0;

  for (let i = 0; i < rand; i++) {
    let temp = randint(0, 5);
    if (temp === 4) elevenCount++;
    while (elevenCount >= 2 && temp === 4) temp = randint(0, 5);
    choosenNumbers.push(primes[temp]);
  }

  const prod = prodNumbers(choosenNumbers);

  choosenNumbers = choosenNumbers.sort((a, b) => a - b);

  let answer = `${prod} = ${choosenNumbers[0]}`;

  for (let i = 1; i < choosenNumbers.length; i++) {
    answer += `\\times` + choosenNumbers[i];
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
    });

    const wrongFactors = [...choosenNumbers];

    for (let i = 0; i < n - 1; i++) {
      let wrongFactor, newFactor, randomIndex, wrongAnswer: string;

      do {
        randomIndex = randint(0, wrongFactors.length);
        wrongFactor = wrongFactors[randomIndex];

        newFactor = wrongFactor;
        while (newFactor === wrongFactor) {
          const temp = randint(0, primes.length);
          newFactor = primes[temp];
        }

        wrongFactors[randomIndex] = newFactor;

        wrongAnswer = `${prod} = ${wrongFactors[0]}`;
        for (let j = 1; j < wrongFactors.length; j++) {
          wrongAnswer += `\\times` + wrongFactors[j];
        }
      } while (res.find((el) => el.statement === wrongAnswer));

      res.push({
        id: v4() + '',
        statement: wrongAnswer,
        isRightAnswer: false,
      });
    }

    return shuffle(res);
  };

  const question: Question = {
    startStatement: `${prod} = ?`,
    answer,
    keys: [],
    getPropositions,
  };
  return question;
}
