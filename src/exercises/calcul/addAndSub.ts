import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

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
  keys: [],
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
  const answer = numbers.reduce((a, b) => a + b);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer.toString(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const randomOffset = randint(-9, 10, [0]);
        const wrongAnswer = answer + randomOffset;
        proposition = {
          id: v4() + '',
          statement: wrongAnswer.toString(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answer + '',
    keys: [],
    getPropositions,
  };
  return question;
}
