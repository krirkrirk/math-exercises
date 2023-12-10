import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { Polynomial, PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { OppositeNode } from '#root/tree/nodes/functions/oppositeNode';
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
type QCMProps = {
  answer: string;
  degree: number;
};
type VEAProps = {};

function getIntegratedPolynomialNode(polynomial: Polynomial) {
  let integralPolynomial: Node = new ConstantNode('C', 'C');

  for (let i = 0; i < polynomial.degree + 1; i++) {
    const coeff = polynomial.coefficients[i];
    if (coeff === 0) continue;
    const nodeCoeff = new Rational(coeff, i + 1).simplify().toTree();
    const powerNode = i + 1 === 1 ? new VariableNode('x') : new PowerNode(new VariableNode('x'), new NumberNode(i + 1));

    let terme;
    if (nodeCoeff.toTex() === '1') terme = powerNode;
    else if (nodeCoeff.toTex() === '-1') terme = new OppositeNode(powerNode);
    else {
      terme = new MultiplyNode(
        nodeCoeff,
        i + 1 === 1 ? new VariableNode('x') : new PowerNode(new VariableNode('x'), new NumberNode(i + 1)),
      );
    }

    integralPolynomial = new AddNode(terme, integralPolynomial);
  }
  return integralPolynomial;
}

export const getPolynomialPrimitive: QuestionGenerator<QCMProps, VEAProps> = () => {
  const degree = randint(1, 4);
  const polynomial = PolynomialConstructor.randomWithOrder(degree);

  const integralPolynomial: Node = getIntegratedPolynomialNode(polynomial);

  const answer = `${integralPolynomial.toTex()}`;
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la forme générale des primitives de la fonction polynomiale $f$ définie par $f(x) = ${polynomial.toTex()}$.`,
    startStatement: `F(x)`,
    answer,
    keys: ['x', 'C'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, degree },
  };

  return question;
};

export const getPolynomialPrimitivePropositions: QCMGenerator<QCMProps> = (n, { answer, degree }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongPolynomial = PolynomialConstructor.randomWithOrder(degree);
    const wrongIntegral = getIntegratedPolynomialNode(wrongPolynomial);
    tryToAddWrongProp(propositions, wrongIntegral.toTex());
  }
  return shuffle(propositions);
};

export const polynomialPrimitive: MathExercise<QCMProps, VEAProps> = {
  id: 'polynomialPrimitive',
  connector: '=',
  label: "Primitive d'une fonction polynomiale",
  levels: ['TermSpé', 'MathComp'],
  sections: ['Primitives'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getPolynomialPrimitive, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getPolynomialPrimitivePropositions,
};
