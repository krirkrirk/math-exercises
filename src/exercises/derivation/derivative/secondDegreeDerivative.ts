import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

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
  const coefficients = [randint(-9, 10), randint(-9, 10), randint(-9, 10, [0])];

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
        const randomCoefficients = [
          randint(-9, 10),
          coefficients[1] + randint(-3, 4),
          coefficients[2] + randint(-3, 4, [0]),
        ];
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
