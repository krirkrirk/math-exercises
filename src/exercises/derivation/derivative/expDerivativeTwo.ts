import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { ExpNode } from '#root/tree/nodes/functions/expNode'; // Importer le nœud d'exponentielle
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const expDerivativeTwo: Exercise = {
  id: 'expDerivativeTwo',
  connector: '=',
  instruction: '',
  label: 'Dérivée de a*exp(x) + b',
  levels: ['1', '0'],
  section: 'Fonctions Exponentielles',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpDerivative, nb),
  keys: ['x'],
};

export function getExpDerivative(): Question {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);

  const myfunction = new AddNode(
    new MultiplyNode(new NumberNode(a), new ExpNode(new VariableNode('x'))),
    new NumberNode(b),
  );
  const derivative = simplifyNode(new MultiplyNode(new NumberNode(a), new ExpNode(new VariableNode('x'))));

  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: derivative.toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < numOptions - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const randomA = randint(-9, 10, [0]);
        proposition = {
          id: v4(),
          statement: simplifyNode(
            new MultiplyNode(new NumberNode(randomA), new ExpNode(new VariableNode('x'))),
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
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${myfunction.toTex()}$.`,
    startStatement: "f'(x)",
    answer: derivative.toTex(),
    keys: ['x'],
    getPropositions,
  };

  return question;
}
