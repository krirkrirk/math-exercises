import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';

export const secondDegreeDerivative: Exercise = {
  id: 'secondDegreeDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'un polynôme de degré 2",
  levels: ['1', '0'],
  section: 'Dérivation',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getSecondDegreeDerivative, nb),
  keys: ['x'],
};

export function getSecondDegreeDerivative(): Question {
  const coefficients = [];

  coefficients.push(randint(-9, 10, [0]));
  for (let i = 1; i <= 2; i++) coefficients.push(randint(-9, 10));

  const polynomial = new Polynomial(coefficients);
  const derivative = polynomial.derivate();

  const question: Question = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${polynomial.toString()}$ `,
    startStatement: `f'(x)`,
    answer: derivative.toString(),
    keys: ['x'],
  };

  return question;
}
