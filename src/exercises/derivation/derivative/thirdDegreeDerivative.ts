import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';

export const thirdDegreeDerivative: Exercise = {
  id: 'thirdDegreeDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'un polynôme de degré 3",
  levels: ['1', '0'],
  section: 'Dérivation',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getThirdDegreeDerivative, nb),
  keys: ['x'],
};

export function getThirdDegreeDerivative(): Question {
  const coefficients = [];

  for (let i = 1; i <= 3; i++) coefficients.push(randint(-9, 10));
  coefficients.push(randint(-9, 10, [0]));

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
