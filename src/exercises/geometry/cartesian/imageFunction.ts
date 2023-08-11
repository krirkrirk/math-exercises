import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const imageFunction: Exercise = {
  id: 'imageFunction',
  connector: '=',
  instruction: '',
  label: "Image d'une fonction",
  levels: ['4', '3', '2'],
  section: 'Géométrie cartésienne',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getImageFunction, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
};

export function getImageFunction(): Question {
  const rand = coinFlip();
  const polynome1 = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  const polynome2 = new Polynomial([randint(-9, 10), randint(-9, 10), randint(-4, 5, [0])]);
  const xValue = randint(-9, 10);

  const statement = rand
    ? `Soit $f(x) = ${polynome1.toTree().toTex()}$. Calculer $f(${xValue})$.`
    : `Soit $f(x) = ${polynome2.toTree().toTex()}$. Calculer $f(${xValue})$.`;

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
    startStatement: `f(${xValue})`,
    answer: answer + '',
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
    getPropositions,
  };
  return question;
}
