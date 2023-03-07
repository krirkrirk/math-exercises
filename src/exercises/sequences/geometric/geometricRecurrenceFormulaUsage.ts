import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';

export const geometricRecurrenceFormulaUsage: Exercise = {
  id: 'geometricRecurrenceFormulaUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la formule de récurrence d'une suite géométrique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getGeometricRecurrenceFormulaUsage, nb),
};

export function getGeometricRecurrenceFormulaUsage(): Question {
  const firstRank = randint(1, 20);
  const firstValue = randint(1, 10);
  const reason = randint(2, 10);
  const askedRank = firstRank + 1;

  const question: Question = {
    instruction: `$(u_n)$ est une suite définie par $u_{n+1} = ${reason}\\times u_n$ et $u_{${firstRank}} = ${firstValue}. Calculer $u_{${askedRank}}`,
    startStatement: `u_{${askedRank}}`,
    answer: (firstValue * reason).toString(),
  };
  return question;
}
