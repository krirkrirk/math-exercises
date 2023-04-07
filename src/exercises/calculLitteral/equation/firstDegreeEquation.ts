import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';

export const firstDegreeEquation: Exercise = {
  id: 'firstDegreeEquation',
  connector: '\\iff',
  instruction: '',
  label: 'Résoudre une équation du premier degré du type $\\frac{a}{x} = b$',
  levels: ['2', '1'],
  section: 'Équations',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeEquation, nb),
};
2;
const pgcd = (a: number, b: number): number => {
  if (b === 0) return a;
  return pgcd(b, a % b);
};

export function getFirstDegreeEquation(): Question {
  let a = randint(-30, 30, [0]);
  let b = randint(-30, 30, [0]);

  const instruction = `Résoudre l'équation suivante $\\frac{${a}}{x} = ${b}$`;
  let answer;

  if (a / b === round(a / b, 0)) answer = `${a / b}`;
  else answer = `\\frac{${a / pgcd(a, b)}}{${b / pgcd(a, b)}}`;

  const question: Question = {
    instruction,
    startStatement: `x = `,
    answer,
  };

  return question;
}
