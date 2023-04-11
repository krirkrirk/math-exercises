import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const equationSimpleSquare: Exercise = {
  id: 'equationSimpleSquare',
  connector: '=',
  instruction: '',
  label: 'Résoudre une équation du second degré du type x² = a',
  levels: ['2', '1'],
  section: 'Équations',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getEquationSimpleSquare, nb),
};

const higherFactor = (n: number): number => {
  for (let i = Math.floor(Math.sqrt(n)); i > 0; i--) if (n % i ** 2 === 0) return i;
  return 1;
};

export function getEquationSimpleSquare(): Question {
  let randNbr = randint(-20, 100);
  let answer;

  if (randNbr >= 0) while (higherFactor(randNbr) === 1) randNbr = randint(1, 100);

  const instruction = `Résoudre l'équation suivante $x^2 = ${randNbr}$`;
  let ans = Math.sqrt(randNbr);

  if (Math.sqrt(randNbr) == Math.floor(Math.sqrt(randNbr)))
    answer = `\\{${Math.sqrt(randNbr)}\\ ; -${Math.sqrt(randNbr)}\\}`;
  else {
    const factor = higherFactor(randNbr);
    const radicand = randNbr / factor ** 2;
    answer = `\\{${factor}\\sqrt{${radicand}}\\ ; -${factor}\\sqrt{${radicand}} \\}`;
  }

  if (randNbr < 0) answer = `\\emptyset`;

  const question: Question = {
    instruction,
    startStatement: `x  `,
    answer,
  };

  return question;
}
