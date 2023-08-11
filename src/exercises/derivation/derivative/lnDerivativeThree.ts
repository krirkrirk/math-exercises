import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { CosNode } from '#root/tree/nodes/functions/cosNode';
import { ExpNode } from '#root/tree/nodes/functions/expNode';
import { LogNode } from '#root/tree/nodes/functions/logNode';
import { SqrtNode } from '#root/tree/nodes/functions/sqrtNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const lnDerivativeThree: Exercise = {
  id: 'lnDerivativeThree',
  connector: '=',
  instruction: '',
  label: 'Dérivée de Ln(x)*(ax+b)',
  levels: ['1', '0'],
  section: 'Fonction Logarithme népérien',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getLnDerivative, nb),
  keys: ['x'],
};

export function getLnDerivative(): Question {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);

  const myfunction = new MultiplyNode(new Polynomial([b, a]).toTree(), new LogNode(new VariableNode('x')));

  const derivative = simplifyNode(
    new AddNode(
      new MultiplyNode(new NumberNode(a), new LogNode(new VariableNode('x'))),
      new FractionNode(new Polynomial([b, a]).toTree(), new VariableNode('x')),
    ),
  );

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
        const randomB = randint(-9, 10);

        proposition = {
          id: v4(),
          statement: simplifyNode(
            new AddNode(
              new MultiplyNode(new NumberNode(randomA), new LogNode(new VariableNode('x'))),
              new FractionNode(new Polynomial([randomB, randomA]).toTree(), new VariableNode('x')),
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
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${myfunction.toTex()} $.`,
    startStatement: "f'(x)",
    answer: derivative.toTex(),
    keys: ['x'],
    getPropositions,
  };

  return question;
}
