import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

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

  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: derivative.toString(),
      isRightAnswer: true,
    });

    for (let i = 0; i < numOptions - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const randomCoefficients = [];

        for (let j = 1; j <= 3; j++) randomCoefficients.push(randint(-9, 10));
        randomCoefficients.push(randint(-9, 10, [0]));

        const randomPolynomial = new Polynomial(randomCoefficients);
        proposition = {
          id: v4(),
          statement: randomPolynomial.derivate().toString(),
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${polynomial.toString()}$.`,
    startStatement: `f'(x)`,
    answer: derivative.toString(),
    keys: ['x'],
    getPropositions,
  };

  return question;
}
