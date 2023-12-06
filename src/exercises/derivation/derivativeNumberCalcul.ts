import { shuffleProps, MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { v4 } from 'uuid';

export const derivativeNumberCalcul: MathExercise = {
  id: 'derivativeNumberCalcul',
  connector: '=',
  instruction: '',
  label: 'Calculer un nombre dérivé via la définition',
  levels: ['1reSpé'],
  isSingleStep: true,
  sections: ['Dérivation', 'Limites'],
  generator: (nb: number) => getDistinctQuestions(getDerivativeNumberCalculQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getDerivativeNumberCalculQuestion(): Question {
  const x = randint(-9, 10);
  const trinom = PolynomialConstructor.randomWithOrder(2);

  const instruction = `Soit $f(x) = ${trinom.toTree().toTex()}$. Calculer $f'(${x})$.`;
  const answer = trinom.derivate().calculate(x) + '';
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(-20, 20) + '';
        proposition = {
          id: v4() + ``,
          statement: wrongAnswer,
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffleProps(res, n);
  };

  const question: Question = {
    answer,
    instruction,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
