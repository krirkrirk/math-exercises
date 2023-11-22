import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { randint } from '#root/math/utils/random/randint';
import { v4 } from 'uuid';

export const explicitFormulaUsage: MathExercise = {
  id: 'explicitFormulaUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la formule explicite d'une suite",
  levels: ['1reESM', '1reSpé', '1reTech'],
  isSingleStep: true,
  sections: ['Suites'],
  generator: (nb: number) => getDistinctQuestions(getExplicitFormulaUsageQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

/**
 *
 * expres alg possibles :
 *  poly: deg1, deg2
 *  trigo
 *  inverse
 *  frac ratio
 *  sqrt
 *  exp ln
 *  powers
 */
/**
 *
 * soit un = ...
 * calculer u3
 * donc il faut le tex de la suite + la valeur en 3
 * deg2, frac rac
 */
export function getExplicitFormulaUsageQuestion(): Question {
  const u = PolynomialConstructor.randomWithOrder(2, 'n');
  const rank = randint(0, 4);
  const answer = u.calculate(rank);
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer + '',
      isRightAnswer: true,
      format: 'tex',
    });
    tryToAddWrongProp(res, u.calculate(rank - 1) + '');
    tryToAddWrongProp(res, u.calculate(rank + 1) + '');
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(-100, 100) + '';
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
    answer: answer + '',
    instruction: `Soit $u$ la suite définie pour tout $n\\geq 0$ par $u_n = ${u
      .toTree()
      .toTex()}$. Calculer $u_${rank}$.`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
