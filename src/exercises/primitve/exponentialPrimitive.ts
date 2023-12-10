import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial, PolynomialConstructor } from '#root/math/polynomials/polynomial';
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

type QCMProps = {
  answer: string;
  rand: boolean;
  a: number;
  coeffs: number[];
};
type VEAProps = {};
export const getExponentialPrimitive: QuestionGenerator<QCMProps, VEAProps> = () => {
  const rand = coinFlip();

  const a = randint(-9, 10);
  const u = PolynomialConstructor.randomWithOrder(randint(1, 3));

  let selectedFunction: Node;
  let integratedFuction: Node;

  if (rand) {
    // a * e^(x)
    const node = new MultiplyNode(new NumberNode(a), new ExpNode(new VariableNode('x')));
    selectedFunction = simplifyNode(node); // le simplify ici a pour but de éviter les 1*e / -1*e
    integratedFuction = node;
  } else {
    // u'(x) * e^(u(x))
    const expUTree = new ExpNode(u.toTree());
    selectedFunction = new MultiplyNode(u.derivate().toTree(), expUTree);
    integratedFuction = expUTree;
  }
  const answer = `${simplifyNode(integratedFuction).toTex()}+C`;
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la forme générale des primitives de la fonction f définie par $f(x) = ${selectedFunction.toTex()}$.`,
    startStatement: `F(x)`,
    answer,
    keys: ['x', 'C', 'epower', 'exp'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a, rand, coeffs: u.coefficients },
  };

  return question;
};

export const getExponentialPrimitivePropositions: QCMGenerator<QCMProps> = (n, { answer, a, rand, coeffs }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (rand) {
    const aNode = new NumberNode(a);
    const xNode = new VariableNode('x');
    const expXTree = new ExpNode(new VariableNode('x'));

    const wrongIntegrals = [
      new MultiplyNode(new NumberNode(-a), expXTree),
      new MultiplyNode(aNode, new ExpNode(new MultiplyNode(aNode, xNode))),
      new MultiplyNode(aNode, new ExpNode(new FractionNode(xNode, aNode))),
      new MultiplyNode(aNode, new ExpNode(new AddNode(xNode, aNode))),
      new MultiplyNode(aNode, new ExpNode(new PowerNode(xNode, aNode))),
      expXTree,
    ];
    wrongIntegrals.forEach((node) => tryToAddWrongProp(propositions, simplifyNode(node).toTex()));
  } else {
    const u = new Polynomial(coeffs);
    const uTree = u.toTree();
    const expXTree = new ExpNode(new VariableNode('x'));
    const expUTree = new ExpNode(uTree);
    const invUTree = new FractionNode(new NumberNode(1), uTree);
    const wrongIntegrals = [
      new MultiplyNode(uTree, expUTree),
      new MultiplyNode(u.derivate().toTree(), expUTree),
      new MultiplyNode(uTree, expXTree),
      new MultiplyNode(invUTree, expXTree),
      new MultiplyNode(invUTree, expUTree),
      new MultiplyNode(new NumberNode(randint(-9, 10, [0])), expUTree),
    ];
    wrongIntegrals.forEach((node) => tryToAddWrongProp(propositions, simplifyNode(node).toTex()));
  }

  while (propositions.length < n) {
    let wrongIntegral = randint(-10, 10) + 'e^x';
    tryToAddWrongProp(propositions, `${wrongIntegral} + C`);
  }
  return shuffleProps(propositions, n);
};

export const exponentialPrimitive: MathExercise<QCMProps, VEAProps> = {
  id: 'exponentialPrimitive',
  connector: '=',
  label: 'Primitive de la fonction exponentielle',
  levels: ['TermSpé', 'MathComp'],
  sections: ['Primitives', 'Exponentielle'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExponentialPrimitive, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getExponentialPrimitivePropositions,
};
