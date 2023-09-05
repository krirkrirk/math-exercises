import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { createRandomPolynomialWithOrder } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { CosNode } from '#root/tree/nodes/functions/cosNode';
import { SinNode } from '#root/tree/nodes/functions/sinNode';
import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const sinCosPrimitive: Exercise = {
  id: 'sinCosPrimitive',
  connector: '=',
  instruction: '',
  label: 'Primitive de sin et cos',
  levels: ['1', '0'],
  section: 'Intégration',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getSinCosPrimitive, nb),
  keys: ['x', 'C', 'sin', 'cos'],
};

export function getSinCosPrimitive(): Question {
  const rand = coinFlip();

  const a = randint(-9, 10, [0]);
  const u = createRandomPolynomialWithOrder(randint(1, 3));

  let selectedFunction: Node;
  let integratedFuction: Node;

  if (rand) {
    // a * cos(x) ou a* sin(x)
    const oneOrTwo = coinFlip();
    selectedFunction = oneOrTwo
      ? new MultiplyNode(new NumberNode(a), new CosNode(new VariableNode('x')))
      : new MultiplyNode(new NumberNode(a), new SinNode(new VariableNode('x')));

    integratedFuction = oneOrTwo
      ? new MultiplyNode(new NumberNode(a), new SinNode(new VariableNode('x')))
      : new MultiplyNode(new NumberNode(-a), new CosNode(new VariableNode('x')));
  } else {
    // u'(x) * cos(u(x))
    const oneOrTwo = coinFlip();
    selectedFunction = oneOrTwo
      ? new MultiplyNode(u.derivate().toTree(), new CosNode(u.toTree()))
      : new MultiplyNode(u.derivate().toTree(), new SinNode(u.toTree()));

    integratedFuction = oneOrTwo
      ? new SinNode(u.toTree())
      : new MultiplyNode(new NumberNode(-1), new CosNode(u.toTree()));
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
            new MultiplyNode(new NumberNode(a), new SinNode(new VariableNode('x'))),
            new MultiplyNode(new NumberNode(-a), new CosNode(new VariableNode('x'))),
            new MultiplyNode(new NumberNode(a), new CosNode(new VariableNode('x'))),
            new MultiplyNode(new NumberNode(-a), new SinNode(new VariableNode('x'))),
            new MultiplyNode(new NumberNode(randint(-9, 10, [a, 0])), new CosNode(new VariableNode('x'))),
            new MultiplyNode(new NumberNode(randint(-9, 10, [a, 0])), new SinNode(new VariableNode('x'))),
          ];
          wrongIntegral = wrongIntegrals[randint(0, wrongIntegrals.length)];
        } else {
          const wrongIntegrals = [
            new MultiplyNode(u.toTree(), new CosNode(u.toTree())),
            new MultiplyNode(u.toTree(), new SinNode(u.toTree())),
            new SinNode(u.toTree()),
            new CosNode(u.toTree()),
            new MultiplyNode(new NumberNode(-1), new CosNode(u.toTree())),
            new MultiplyNode(new NumberNode(-1), new SinNode(u.toTree())),
            new MultiplyNode(new NumberNode(randint(-9, 10, [0])), new CosNode(new VariableNode('x'))),
            new MultiplyNode(new NumberNode(randint(-9, 10, [0])), new SinNode(new VariableNode('x'))),
          ];
          wrongIntegral = wrongIntegrals[randint(0, wrongIntegrals.length)];
        }
        proposition = {
          id: v4(),
          statement: `${simplifyNode(wrongIntegral).toTex()} + C`,
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Déterminer la forme générale des primitives de la fonction f définie par $f(x) = ${simplifyNode(
      selectedFunction,
    ).toTex()}$.`,
    startStatement: `F(x)`,
    answer: `${simplifyNode(integratedFuction).toTex()} + C`,
    keys: ['x', 'C', 'sin', 'cos'],
    getPropositions,
  };

  return question;
}
