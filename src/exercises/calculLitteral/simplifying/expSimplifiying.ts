import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { AffineConstructor } from '#root/math/polynomials/affine';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { ExpNode } from '#root/tree/nodes/functions/expNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const expSimplifiying: Exercise = {
  id: 'expSimplifiying',
  connector: '\\iff',
  instruction: '',
  label: "Simplifier des expressions avec l'exponentiel",
  levels: ['1', '0'],
  section: 'Fonctions Exponentielles',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpSimplifiying, nb),
  keys: ['x'],
};

export function getExpSimplifiying(): Question {
  const random = randint(1, 4);

  let expression;

  switch (random) {
    case 1:
      expression = new FractionNode(
        new MultiplyNode(
          new ExpNode(new Polynomial([0, randint(-9, 10, [0])]).toTree()),
          new ExpNode(new NumberNode(randint(-9, 10, [0]))),
        ),
        new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
      );
      expression.shuffle();
      break;
    case 2:
      expression = new MultiplyNode(
        new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
        new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
      );
      expression.shuffle();
      break;
    case 3:
      expression = new FractionNode(
        new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
        new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
      );
      expression.shuffle();
      break;
    default:
      expression = new ExpNode(new VariableNode('x'));
  }

  const simplifiedExpression = simplifyNode(expression);

  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: simplifiedExpression.toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < numOptions - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        let wrongExpression;
        switch (random) {
          case 1:
            wrongExpression = new FractionNode(
              new MultiplyNode(
                new ExpNode(new Polynomial([0, randint(-9, 10, [0])]).toTree()),
                new ExpNode(new NumberNode(randint(-9, 10, [0]))),
              ),
              new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
            );
            wrongExpression.shuffle();
            break;
          case 2:
            wrongExpression = new MultiplyNode(
              new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
              new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
            );
            wrongExpression.shuffle();
            break;
          case 3:
            wrongExpression = new FractionNode(
              new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
              new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
            );
            wrongExpression.shuffle();
            break;
          default:
            wrongExpression = new ExpNode(new VariableNode('x'));
        }
        proposition = {
          id: v4(),
          statement: simplifyNode(wrongExpression).toTex(),
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Simplifier l'expression $${expression.toTex()}$.`,
    startStatement: '',
    answer: simplifiedExpression.toTex(),
    keys: [],
    getPropositions,
  };

  return question;
}
