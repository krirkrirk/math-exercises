import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const mentalAddAndSub: Exercise = {
  id: 'mentalAddAndSub',
  connector: '=',
  instruction: 'Calculer.',
  label: 'Effectuer mentalement des additions et des soustractions simples',
  levels: ['6', '5', '4', '3', '2', '1', '0'],
  section: 'Calculs',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getMentalAddAndSub, nb),
  keys: [],
};

export function getMentalAddAndSub(): Question {
  let numbers: number[] = [];
  const nbrOperations = coinFlip() ? 2 : 3;

  numbers[0] = coinFlip() ? randint(1, 10) : randint(10, 100) / 10;
  numbers[1] = coinFlip() ? randint(-100, 100) / 10 : randint(-1000, 1000) / 100;

  let sum = numbers[0] + numbers[1];

  if (nbrOperations === 3) {
    numbers[2] = coinFlip() ? randint(-100, 100) / 10 : randint(-1000, 1000) / 100;
    sum += numbers[2];
    sum = round(sum * 10, 0);
    numbers[2] = round(sum / 10 - numbers[0] - numbers[1], 2);
    sum = numbers[0] + numbers[1] + numbers[2];
  }

  const allNumbersNodes = numbers.map((nb) => new NumberNode(nb));
  let statementTree = new AddNode(allNumbersNodes[0], allNumbersNodes[1]);
  for (let i = 2; i < nbrOperations; i++) statementTree = new AddNode(statementTree, allNumbersNodes[i]);
  statementTree.shuffle();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    // Ajout de la réponse correcte
    const answer = round(sum, 2);
    res.push({
      id: v4() + '',
      statement: answer.toString(),
      isRightAnswer: true,
    });

    // Ajout des propositions incorrectes
    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const incorrectSum = round(sum + (coinFlip() ? 1 : -1) * Math.random() * 10, 2);
        proposition = {
          id: v4() + '',
          statement: incorrectSum.toString(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    // Mélange des propositions
    return shuffle(res);
  };

  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: round(sum, 2) + '',
    keys: [],
    getPropositions,
  };
  return question;
}
