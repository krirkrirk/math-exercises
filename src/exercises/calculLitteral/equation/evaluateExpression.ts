import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const evaluateExpression: Exercise = {
  id: 'evaluateExpression',
  connector: '=',
  instruction: '',
  label: 'Evaluer une expression',
  levels: ['4', '3', '2'],
  section: 'Équations',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getEvaluateExpression, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
};

export function getEvaluateExpression(): Question {
  const rand = coinFlip();
  const polynome1 = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  const polynome2 = new Polynomial([randint(-9, 10), randint(-9, 10), randint(-4, 5, [0])]);
  const xValue = randint(-9, 10);

  const statement = rand
    ? `Calculer $${polynome1.toTree().toTex()}$ pour x = $${xValue}$`
    : `Calculer $${polynome2.toTree().toTex()}$ pour x = $${xValue}$`;

  const answer = rand ? polynome1.calculate(xValue) : polynome2.calculate(xValue);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer + '',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = answer + randint(-10, 11, [0]);
        proposition = {
          id: v4() + '',
          statement: wrongAnswer + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: statement,
    answer: answer + '',
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
    getPropositions,
  };
  return question;
}
