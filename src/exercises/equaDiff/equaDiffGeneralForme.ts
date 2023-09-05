import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { ExpNode } from '#root/tree/nodes/functions/expNode';
import { ConstantNode } from '#root/tree/nodes/numbers/constantNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { EqualNode } from '#root/tree/nodes/operators/equalNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const exponentialDifferentialEquation: Exercise = {
  id: 'exponentialDifferentialEquation',
  connector: '=',
  instruction: '',
  label: "Équation Différentielle : y' = ay",
  levels: ['1', '0'],
  section: 'Équations Différentielles',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExponentialEquation, nb),
  keys: ['x', 'y', 'exp', 'C', 'equal'],
};

export function getExponentialEquation(): Question {
  const a = randint(-9, 10, [0]);

  const myEquation = simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('y')));

  const myAnswer = new EqualNode(
    new VariableNode('y'),
    new MultiplyNode(
      new ConstantNode('C', 'C'),
      new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x')))),
    ),
  ); // y = Ce^(ax);

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: myAnswer.toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const a = randint(1, 10);
        const myWrongAnswer = new EqualNode(
          new VariableNode('y'),
          new MultiplyNode(
            new ConstantNode('C', 'C'),
            new ExpNode(new MultiplyNode(new NumberNode(a), new VariableNode('x'))),
          ),
        );
        proposition = {
          id: v4(),
          statement: myWrongAnswer.toTex(),
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Résoudre l'équation différentielle suivante : $y' = ${myEquation.toTex()}$.`,
    startStatement: `y(x)`,
    answer: myAnswer.toTex(),
    keys: ['x', 'y', 'exp', 'C', 'equal'],
    getPropositions,
  };

  return question;
}
