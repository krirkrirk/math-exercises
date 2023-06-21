import { Exercise, GeneratorOptions, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const arithmeticRecurrenceFormulaUsage: Exercise = {
  id: 'arithmeticRecurrenceFormulaUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la formule de récurrence d'une suite arithmétique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getArithmeticRecurrenceFormulaUsage, nb),
  keys: ['r', 'n', 'u', 'underscore'],
};

export function getArithmeticRecurrenceFormulaUsage(): Question {
  const firstRank = randint(1, 20);
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);
  const askedRank = firstRank + 1;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: (firstValue + reason).toString(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: firstValue + reason + randint(-5, 6, [0]) + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `$(u_n)$ est une suite définie par $u_{n+1} = ${reason} + u_n$ et $u_{${firstRank}} = ${firstValue}$. Calculer :`,
    startStatement: `u_{${askedRank}}`,
    answer: (firstValue + reason).toString(),
    keys: ['r', 'n', 'u', 'underscore'],
    getPropositions,
  };
  return question;
}
