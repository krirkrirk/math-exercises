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

export const arithmeticFindExplicitFormula: Exercise = {
  id: 'arithmeticFindExplicitFormula',
  connector: '=',
  instruction: '',
  label: "Déterminer la formule générale d'une suite arithmétique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getArithmeticFindExplicitFormula, nb),
};

export function getArithmeticFindExplicitFormula(): Question {
  const firstRank = 0;
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);

  const formula = new Polynomial([firstValue, reason], 'n');

  const question: Question = {
    instruction: `$(u_n)$ est une suite arithmétique de premier terme $u_{${firstRank}} = ${firstValue}$ et de raison $r = ${reason}$. $\\\\$ Donner l'expression de $u_n$ en fonction de $n$.`,
    startStatement: 'u_n',
    answer: formula.toString(),
    keys: ['n'],
  };

  return question;
}
