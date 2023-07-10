import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const arithmeticFindExplicitFormula: Exercise = {
  id: 'arithmeticFindExplicitFormula',
  connector: '=',
  instruction: '',
  label: "Déterminer la formule générale d'une suite arithmétique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getArithmeticFindExplicitFormula, nb),
  keys: ['r', 'n', 'u', 'underscore'],
};

export function getArithmeticFindExplicitFormula(): Question {
  const firstRank = 0;
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);

  const formula = new Polynomial([firstValue, reason], 'n');

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: formula.toString(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: new Polynomial([firstValue + randint(-3, 4), reason + randint(-3, 4)], 'n').toString(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `$(u_n)$ est une suite arithmétique de premier terme $u_{${firstRank}} = ${firstValue}$ et de raison $r = ${reason}$. $\\\\$ Donner l'expression de $u_n$ en fonction de $n$.`,
    startStatement: 'u_n',
    answer: formula.toString(),
    keys: ['r', 'n', 'u', 'underscore'],
    getPropositions,
  };

  return question;
}
