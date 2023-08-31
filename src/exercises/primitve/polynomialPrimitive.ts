import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial, createRandomPolynomialWithOrder } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { Node } from '#root/tree/nodes/node';
import { ConstantNode } from '#root/tree/nodes/numbers/constantNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const polynomialPrimitive: Exercise = {
  id: 'polynomialPrimitive',
  connector: '=',
  instruction: '',
  label: "Primitive d'une fonction polynomiale",
  levels: ['1', '0'],
  section: 'Intégration',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getPolynomialPrimitive, nb),
  keys: ['x', 'C'],
};

function getIntegratedPolynomialNode(polynomial: Polynomial) {
  let integralPolynomial: Node = new ConstantNode('C', 'C');

  for (let i = 0; i < polynomial.degree + 1; i++) {
    const coeff = polynomial.coefficients[i];
    if (coeff === 0) continue;
    const nodeCoeff = new FractionNode(new NumberNode(coeff), new NumberNode(i + 1));
    const terme = new MultiplyNode(
      simplifyNode(nodeCoeff),
      i + 1 === 1 ? new VariableNode('x') : new PowerNode(new VariableNode('x'), new NumberNode(i + 1)),
    );
    integralPolynomial = new AddNode(terme, integralPolynomial);
  }
  return integralPolynomial;
}

export function getPolynomialPrimitive(): Question {
  const degree = randint(1, 4);
  const polynomial = createRandomPolynomialWithOrder(degree);

  const integralPolynomial: Node = getIntegratedPolynomialNode(polynomial);

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: `${integralPolynomial.toTex()}`,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const wrongPolynomial = createRandomPolynomialWithOrder(degree);
        const wrongIntegral = getIntegratedPolynomialNode(wrongPolynomial);
        proposition = {
          id: v4(),
          statement: wrongIntegral.toTex(),
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Déterminer la forme générale des primitives de la fonction polynomiale $f$ définie par $f(x) = ${polynomial.toTex()}$.`,
    startStatement: `F(x)`,
    answer: `${integralPolynomial.toTex()}`,
    keys: ['x', 'C'],
    getPropositions,
  };

  return question;
}
