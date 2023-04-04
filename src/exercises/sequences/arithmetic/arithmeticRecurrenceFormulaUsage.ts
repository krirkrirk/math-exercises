import { Exercise, GeneratorOptions, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const arithmeticRecurrenceFormulaUsage: Exercise = {
  id: 'arithmeticRecurrenceFormulaUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la formule de récurrence d'une suite arithmétique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getArithmeticRecurrenceFormulaUsage, nb),
};

export function getArithmeticRecurrenceFormulaUsage(): Question {
  const firstRank = randint(1, 20);
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);
  const askedRank = firstRank + 1;

  const question: Question = {
    instruction: `$(u_n)$ est une suite définie par $u_{n+1} = ${reason} + u_n$ et $u_{${firstRank}} = ${firstValue}$. Calculer :`,
    startStatement: `u_{${askedRank}}`,
    answer: (firstValue + reason).toString(),
  };
  return question;
}
