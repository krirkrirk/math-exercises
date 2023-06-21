import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

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

  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: answerStatement.toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < numOptions - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const wrongExponent = randint(2, 10);
        proposition = {
          id: v4(),
          statement: simplifyNode(
            new MultiplyNode(
              new NumberNode(a * wrongExponent),
              new PowerNode(new VariableNode('x'), new NumberNode(wrongExponent - 1)),
            ),
          ).toTex(),
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =${statement.toTex()}$.`,
    startStatement: `f'(x)`,
    answer: answerStatement.toTex(),
    keys: ['x'],
    getPropositions,
  };

  return question;
}
