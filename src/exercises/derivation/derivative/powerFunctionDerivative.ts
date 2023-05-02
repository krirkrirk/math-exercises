import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';

export const powerFunctionDerivative: Exercise = {
  id: 'powerFunctionDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'une fonction puissance",
  levels: ['1', '0'],
  section: 'Dérivation',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getPowerFunctionDerivative, nb),
  keys: ['x'],
};

export function getPowerFunctionDerivative(): Question {
  const a = randint(-9, 10, [0]);
  const n = randint(2, 10);

  const statement = simplifyNode(
    new MultiplyNode(new NumberNode(a), new PowerNode(new VariableNode('x'), new NumberNode(n))),
  );

  const answerStatement = simplifyNode(
    new MultiplyNode(new NumberNode(a * n), new PowerNode(new VariableNode('x'), new NumberNode(n - 1))),
  );

  const question: Question = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =${statement.toTex()}$.`,
    startStatement: `f'(x)`,
    answer: answerStatement.toTex(),
    keys: ['x'],
  };

  return question;
}
