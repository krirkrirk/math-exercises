import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { ExpNode } from '#root/tree/nodes/functions/expNode';
import { OppositeNode } from '#root/tree/nodes/functions/oppositeNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { EqualNode } from '#root/tree/nodes/operators/equalNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { OperatorNode } from '#root/tree/nodes/operators/operatorNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const exponentialDifferentialEquationWithIC: Exercise = {
  id: 'exponentialDifferentialEquationWithIC',
  connector: '=',
  instruction: '',
  label: "Équation Différentielle : y' = ay avec Conditions Initiales",
  levels: ['1', '0'],
  section: 'Équations Différentielles',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(solveExponentialEquationWithIC, nb),
  keys: ['x', 'y', 'exp', 'equal'],
};

export function solveExponentialEquationWithIC(): Question {
  const a = randint(-9, 10, [0]);
  const initialY = randint(-9, 10);

  const myEquation = simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('y')));
  const myAnswer =
    initialY === 0
      ? new NumberNode(0) // y(0) = 0 ==> y(x) = 0
      : new EqualNode(
          new VariableNode('y'),
          initialY === 1
            ? new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x')))) // éviter les 1e^(x)
            : initialY === -1
            ? new OppositeNode(new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x'))))) // éviter les -1e^(x)
            : new MultiplyNode(
                new NumberNode(initialY),
                new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x')))),
              ),
        ); // y = y(0)e^(ax);

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
        const a = randint(-9, 10, [0]);
        const initialY = randint(-9, 10);
        const myWrongAnswer =
          initialY === 0
            ? new NumberNode(0)
            : new EqualNode(
                new VariableNode('y'),
                initialY === 1
                  ? new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x'))))
                  : initialY === -1
                  ? new OppositeNode(
                      new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x')))),
                    )
                  : new MultiplyNode(
                      new NumberNode(initialY),
                      new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x')))),
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
    instruction: `Résoudre l'équation différentielle suivante avec la condition initiale $y(0) = ${initialY}$ : $y' = ${myEquation.toTex()}$.`,
    startStatement: `y(x)`,
    answer: myAnswer.toTex(),
    keys: ['x', 'y', 'exp', 'equal'],
    getPropositions,
  };

  return question;
}
