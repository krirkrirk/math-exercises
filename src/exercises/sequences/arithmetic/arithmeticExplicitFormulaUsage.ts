import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { SubstractNode } from '#root/tree/nodes/operators/substractNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';

export const arithmeticExplicitFormulaUsage: Exercise = {
  id: 'arithmeticExplicitFormulaUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la formule générale d'une suite arithmétique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getArithmeticExplicitFormulaUsage, nb),
};

export function getArithmeticExplicitFormulaUsage(): Question {
  const askedRank = randint(0, 10);
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);

  const polynomial = new Polynomial([firstValue, reason], 'n');

  const question: Question = {
    instruction: `$(u_n)$ est une suite arithmétique définie par $u_n = ${polynomial.toString()}$. Calculer :`,
    startStatement: `u_{${askedRank}}`,
    answer: (firstValue + askedRank * reason).toString(),
    keys: [],
  };

  return question;
}
