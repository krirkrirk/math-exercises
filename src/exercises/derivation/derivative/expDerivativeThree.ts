import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { ExpNode } from '#root/tree/nodes/functions/expNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const expDerivativeThree: Exercise = {
  id: 'expDerivativeThree',
  connector: '=',
  instruction: '',
  label: 'Dérivée de $(ax+b) \\times exp(x)$',
  levels: ['1', '0'],
  section: 'Fonction Exponentielle',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpDerivativeThree, nb),
  keys: ['exp'],
};

export function getExpDerivativeThree(): Question {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);

  const myfunction = new MultiplyNode(new Polynomial([b, a]).toTree(), new ExpNode(new VariableNode('x')));
  const derivative = new MultiplyNode(new Polynomial([b + a, a]).toTree(), new ExpNode(new VariableNode('x')));

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
          statement: new MultiplyNode(
            new Polynomial([randomB + randomA, randomA]).toTree(),
            new ExpNode(new VariableNode('x')),
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
    keys: ['exp'],
    getPropositions,
  };

  return question;
}
