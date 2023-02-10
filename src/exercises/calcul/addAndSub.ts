import { randint } from '../../mathutils/random/randint';
import { NumberNode } from '../../tree/nodes/numbers/numberNode';
import { AddNode } from '../../tree/nodes/operators/addNode';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

/**
 * a±b±c±d
 */
export const addAndSubExercise: Exercise = {
  id: 'addAndSub',
  connector: '=',
  instruction: 'Calculer :',
  label: 'Additions et soustractions',
  levels: ['6', '5'],
  section: 'Calculs',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getAddAndSubQuestions, nb),
};

export function getAddAndSubQuestions(): Question {
  const nbOperations = randint(2, 4);
  const numbers = [];
  for (let i = 0; i < nbOperations + 1; i++) {
    numbers.push(randint(-15, 15, [0]));
  }
  const allNumbersNodes = numbers.map((nb) => new NumberNode(nb));
  let statementTree = new AddNode(allNumbersNodes[0], allNumbersNodes[1]);
  for (let i = 2; i < allNumbersNodes.length; i++) {
    statementTree = new AddNode(statementTree, allNumbersNodes[i]);
  }
  const answer = numbers.reduce((a, b) => a + b) + '';
  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answer,
  };
  return question;
}
