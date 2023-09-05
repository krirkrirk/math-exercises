import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { createRandomPolynomialWithOrder } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { ExpNode } from '#root/tree/nodes/functions/expNode';
import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const exponentialPrimitive: Exercise = {
  id: 'exponentialPrimitive',
  connector: '=',
  instruction: '',
  label: 'Primitive de la fonction exponentielle',
  levels: ['1', '0'],
  section: 'Intégration',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExponentialPrimitive, nb),
  keys: ['x', 'C', 'exp'],
};

export function getExponentialPrimitive(): Question {
  const rand = coinFlip();

  const a = randint(-9, 10);
  const u = createRandomPolynomialWithOrder(randint(1, 3));

  let selectedFunction: Node;
  let integratedFuction: Node;

  if (rand) {
    // a * e^(x)
    selectedFunction = simplifyNode(new MultiplyNode(new NumberNode(a), new ExpNode(new VariableNode('x')))); // le simplify ici a pour but de éviter les 1*e / -1*e
    integratedFuction = new MultiplyNode(new NumberNode(a), new ExpNode(new VariableNode('x')));
  } else {
    // u'(x) * e^(u(x))
    const oneOrTwo = coinFlip();
    selectedFunction = new MultiplyNode(u.derivate().toTree(), new ExpNode(u.toTree()));
    integratedFuction = new ExpNode(u.toTree());
  }

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: `${simplifyNode(integratedFuction).toTex()} + C`,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;
      let wrongIntegral;

      do {
        if (rand) {
          const wrongIntegrals = [
            new MultiplyNode(new NumberNode(-a), new ExpNode(new VariableNode('x'))),
            new MultiplyNode(
              new NumberNode(a),
              new ExpNode(new MultiplyNode(new NumberNode(a), new VariableNode('x'))),
            ),
            new MultiplyNode(
              new NumberNode(a),
              new ExpNode(new FractionNode(new VariableNode('x'), new NumberNode(a))),
            ),
            new MultiplyNode(new NumberNode(a), new ExpNode(new AddNode(new VariableNode('x'), new NumberNode(a)))),
            new MultiplyNode(new NumberNode(a), new ExpNode(new PowerNode(new VariableNode('x'), new NumberNode(a)))),
            new ExpNode(new VariableNode('x')),
          ];
          wrongIntegral = simplifyNode(wrongIntegrals[randint(0, wrongIntegrals.length)]);
        } else {
          const wrongIntegrals = [
            new MultiplyNode(u.toTree(), new ExpNode(u.toTree())),
            new MultiplyNode(u.derivate().toTree(), new ExpNode(u.toTree())),
            new MultiplyNode(u.toTree(), new ExpNode(new VariableNode('x'))),
            new MultiplyNode(new FractionNode(new NumberNode(1), u.toTree()), new ExpNode(new VariableNode('x'))),
            new MultiplyNode(new FractionNode(new NumberNode(1), u.toTree()), new ExpNode(u.toTree())),
            new MultiplyNode(new NumberNode(randint(-9, 10, [0])), new ExpNode(u.toTree())),
          ];
          wrongIntegral = wrongIntegrals[randint(0, wrongIntegrals.length)];
        }
        proposition = {
          id: v4(),
          statement: `${wrongIntegral.toTex()} + C`,
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Déterminer la forme générale des primitives de la fonction f définie par $f(x) = ${selectedFunction.toTex()}$.`,
    startStatement: `F(x)`,
    answer: `${simplifyNode(integratedFuction).toTex()} + C`,
    keys: ['x', 'C', 'exp'],
    getPropositions,
  };

  return question;
}
