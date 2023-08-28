import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { EqualNode } from '#root/tree/nodes/operators/equalNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const euclideanDivision: Exercise = {
  id: 'euclideanDivision',
  connector: '=',
  instruction: '',
  label: 'Ecrire une division euclidienne',
  levels: ['6', '5', '4'],
  section: 'Arithmétique',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getEuclideanDivisionQuestions, nb),
  keys: ['equal'],
};

export function getEuclideanDivisionQuestions(): Question {
  let dividend = randint(5, 100);
  let divisor = randint(2, 11);

  while (dividend % divisor === 0) {
    dividend = randint(5, 100);
    divisor = randint(2, 11);
  }

  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;

  const answer = new EqualNode(
    new NumberNode(dividend),
    new AddNode(new MultiplyNode(new NumberNode(divisor), new NumberNode(quotient)), new NumberNode(remainder)),
  );

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer.toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const divisor = randint(2, 11);
        const quotient = Math.floor(randint(5, 100) / divisor);
        const remainder = randint(5, 100) % divisor;
        const wrongAnswer = new EqualNode(
          new NumberNode(dividend),
          new AddNode(new MultiplyNode(new NumberNode(divisor), new NumberNode(quotient)), new NumberNode(remainder)),
        );

        proposition = {
          id: v4() + '',
          statement: wrongAnswer.toTex(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Ecrire la division euclidienne de ${dividend} par ${divisor}`,
    answer: answer.toTex(),
    keys: ['equal'],
    getPropositions,
  };
  return question;
}
