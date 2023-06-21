import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const arithmeticExplicitFormulaUsage: Exercise = {
  id: 'arithmeticExplicitFormulaUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la formule générale d'une suite arithmétique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getArithmeticExplicitFormulaUsage, nb),
  keys: ['r', 'n', 'u', 'underscore'],
};

export function getArithmeticExplicitFormulaUsage(): Question {
  const askedRank = randint(0, 10);
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);

  const polynomial = new Polynomial([firstValue, reason], 'n');

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: (firstValue + askedRank * reason).toString(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: (randint(-5, 6, [firstValue]) + askedRank * reason).toString(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `$(u_n)$ est une suite arithmétique définie par $u_n = ${polynomial.toString()}$. Calculer :`,
    startStatement: `u_{${askedRank}}`,
    answer: (firstValue + askedRank * reason).toString(),
    keys: ['r', 'n', 'u', 'underscore'],
    getPropositions,
  };

  return question;
}
