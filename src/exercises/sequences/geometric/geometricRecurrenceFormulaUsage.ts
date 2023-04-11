import { Exercise, GeneratorOptions, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

interface GeometricRecurrenceFormulaUsageOptions extends GeneratorOptions {
  test: boolean;
}

export const geometricRecurrenceFormulaUsage: Exercise = {
  id: 'geometricRecurrenceFormulaUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la formule de récurrence d'une suite géométrique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number, options: GeometricRecurrenceFormulaUsageOptions) =>
    getDistinctQuestions(getGeometricRecurrenceFormulaUsage, nb),
};

export function getGeometricRecurrenceFormulaUsage(options: GeometricRecurrenceFormulaUsageOptions): Question {
  const firstRank = randint(1, 20);
  const firstValue = randint(1, 10);
  const reason = randint(2, 10);
  const askedRank = firstRank + 1;

  const question: Question = {
    instruction: `$(u_n)$ est une suite définie par $u_{n+1} = ${reason}\\times u_n$ et $u_{${firstRank}} = ${firstValue}$. Calculer :`,
    startStatement: `u_{${askedRank}}`,
    answer: (firstValue * reason).toString(),
    keys: ['q', 'n', 'u', 'underscore'],
  };
  return question;
}
