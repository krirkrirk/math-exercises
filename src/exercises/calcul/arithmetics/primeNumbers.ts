import { randint } from '#root/math/utils/random/randint';

import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from '../../exercise';
import { getDistinctQuestions } from '../../utils/getDistinctQuestions';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';

function prodNumbers(tab: number[]) {
  let temp = 1;
  for (let i = 0; i < tab.length; i++) temp *= tab[i];
  return temp;
}

const primes = [2, 3, 5, 7, 11];

const getPrimeNumbers: QuestionGenerator<QCMProps> = () => {
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

  const numberNodes = choosenNumbers.map((nb) => new NumberNode(nb));
  let tree = new MultiplyNode(numberNodes[numberNodes.length - 1], numberNodes[numberNodes.length - 2]);
  for (let i = numberNodes.length - 3; i > -1; i--) {
    tree = new MultiplyNode(numberNodes[i], tree);
  }

  let answer = tree.toTex();

  const question: Question<QCMProps> = {
    instruction: `Donner la décomposition en nombres premiers de : $${prod}$`,
    startStatement: `${prod}`,
    answer,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, choosenNumbers },
  };
  return question;
};

type QCMProps = {
  answer: string;
  choosenNumbers: number[];
};
const getPropositions: QCMGenerator<QCMProps> = (n: number, { answer, choosenNumbers }) => {
  const res: Proposition[] = [];
  addValidProp(res, answer);
  const wrongFactors = [...choosenNumbers];

  while (res.length < n) {
    let wrongFactor, newFactor, randomIndex, wrongAnswer: string;
    randomIndex = randint(0, wrongFactors.length);
    wrongFactor = wrongFactors[randomIndex];

    newFactor = wrongFactor;
    while (newFactor === wrongFactor) {
      const temp = randint(0, primes.length);
      newFactor = primes[temp];
    }

    wrongFactors[randomIndex] = newFactor;

    wrongAnswer = `${wrongFactors[0]}`;
    for (let j = 1; j < wrongFactors.length; j++) {
      wrongAnswer += `\\times` + wrongFactors[j];
    }

    tryToAddWrongProp(res, wrongAnswer);
  }
  return shuffleProps(res, n);
};

export const primeNumbers: MathExercise = {
  id: 'primeNumbers',
  connector: '=',
  label: 'Décomposition en nombres premiers',
  levels: ['5ème', '4ème', '3ème', '2nde'],
  sections: ['Arithmétique'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getPrimeNumbers, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
