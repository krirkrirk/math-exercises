import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';

export const geometricExplicitFormulaUsage: Exercise = {
  id: 'geometricExplicitFormulaUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la formule générale d'une suite géométrique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getGeometricExplicitFormulaUsage, nb),
  keys: ['n', 'u', 'underscore'],
};

export function getGeometricExplicitFormulaUsage(): Question {
  const askedRank = randint(0, 10);

  const firstValue = randint(1, 10);
  const reason = randint(2, 10);
  const formula = new MultiplyNode(
    new NumberNode(firstValue),
    new PowerNode(new NumberNode(reason), new VariableNode('n')),
  );
  const formulaTex = simplifyNode(formula).toTex();
  const question: Question = {
    instruction: `$(u_n)$ est une suite géométrique définie par $u_n = ${formulaTex}$. Calculer :`,
    startStatement: `u_{${askedRank}}`,
    answer: (firstValue * Math.pow(reason, askedRank)).toString(),
    keys: ['n', 'u', 'underscore'],
  };
  return question;
}
