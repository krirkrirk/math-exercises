import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';

export const thirdDegreeDerivative: Exercise = {
  id: 'thirdDegreeDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'un polynôme de degré 3",
  levels: ['2', '1'],
  section: 'Dérivées',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getThirdDegreeDerivative, nb),
};

export function getThirdDegreeDerivative(): Question {
  const coefficients = [];

  coefficients.push(randint(-10, 10, [0]));
  for (let i = 1; i <= 3; i++) coefficients.push(randint(-10, 10));

  const polynomial = new Polynomial(coefficients);
  const derivative = polynomial.derivate();

  const question: Question = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${polynomial.toString()}$ `,
    startStatement: `f'(x)`,
    answer: derivative.toString(),
  };

  return question;
}
