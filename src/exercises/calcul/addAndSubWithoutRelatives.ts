import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

/**
 * a±b±c±d
 */
export const addAndSubWithoutRelatives: Exercise = {
  id: 'addAndSubWithoutRelatives',
  connector: '=',
  instruction: 'Calculer :',
  label: 'Additions et soustractions sans les nombres relatifs',
  levels: ['6', '5'],
  section: 'Calculs',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getAddAndSubWithoutRelatives, nb),
};

export function getAddAndSubWithoutRelatives(): Question {
  let answer = -1;
  let statementTree: any;

  while (answer < 0) {
    const nbOperations = randint(2, 4);
    let numbers = [];

    do {
      numbers = [];
      numbers.push(randint(1, 15));
      let sum = numbers[0];

      for (let i = 1; i < nbOperations + 1; i++) {
        numbers.push(randint(-sum, 15, [0]));
        sum += numbers[i];
      }
    } while (numbers.every((a) => a > 0));

    const allNumbersNodes = numbers.map((nb) => new NumberNode(nb));
    statementTree = new AddNode(allNumbersNodes[0], allNumbersNodes[1]);
    for (let i = 2; i < allNumbersNodes.length; i++) {
      statementTree = new AddNode(statementTree, allNumbersNodes[i]);
    }
    answer = numbers.reduce((a, b) => a + b);
  }

  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answer.toString(),
  };
  return question;
}