import { MathExercise, Proposition, Question, shuffleProps, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const thirdDegreeDerivative: MathExercise = {
  id: 'thirdDegreeDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'un polynôme de degré 3",
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp', '1rePro', 'TermPro', 'TermTech'],
  sections: ['Dérivation'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getThirdDegreeDerivative, nb),
  keys: ['x'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getThirdDegreeDerivative(): Question {
  const coefficients: number[] = [];

  for (let i = 1; i <= 3; i++) coefficients.push(randint(-9, 10));
  coefficients.push(randint(-9, 10, [0]));

  const polynomial = new Polynomial(coefficients);
  const derivative = polynomial.derivate();
  const answer = derivative.toTree().toTex();
  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    if (coefficients[2] !== 0)
      tryToAddWrongProp(
        propositions,
        new Polynomial([coefficients[0], coefficients[1], coefficients[2]]).toTree().toTex(),
      );
    if (coefficients[2] !== 0)
      tryToAddWrongProp(
        propositions,
        new Polynomial([coefficients[0] + coefficients[1], coefficients[1], coefficients[2]]).toTree().toTex(),
      );

    const missing = numOptions - propositions.length;
    for (let i = 0; i < missing; i++) {
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
          format: 'tex',
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffleProps(propositions, numOptions);
  };

  const question: Question = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${polynomial.toString()}$.`,
    startStatement: `f'(x)`,
    answer: answer,
    keys: ['x'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
