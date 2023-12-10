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
import { Polynomial, PolynomialConstructor } from '#root/math/polynomials/polynomial';
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

type QCMProps = {
  answer: string;
  rand: boolean;
  a: number;
  coeffs: number[];
};
type VEAProps = {};

export const getSinCosPrimitive: QuestionGenerator<QCMProps, VEAProps> = () => {
  const rand = coinFlip();

  const a = randint(-9, 10, [0]);
  const u = PolynomialConstructor.randomWithOrder(randint(1, 3));

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

  const answer = `${simplifyNode(integratedFuction).toTex()}+C`;

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la forme générale des primitives de la fonction f définie par $f(x) = ${simplifyNode(
      selectedFunction,
    ).toTex()}$.`,
    startStatement: `F(x)`,
    answer,
    keys: ['x', 'C', 'sin', 'cos'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a, rand, coeffs: u.coefficients },
  };

  return question;
};

export const getSinCosPrimitivePropositions: QCMGenerator<QCMProps> = (n, { answer, rand, a, coeffs }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const u = new Polynomial(coeffs);
  while (propositions.length < n) {
    let wrongIntegral;

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
    tryToAddWrongProp(propositions, `${simplifyNode(wrongIntegral).toTex()} + C`);
  }

  return shuffle(propositions);
};

export const sinCosPrimitive: MathExercise<QCMProps, VEAProps> = {
  id: 'sinCosPrimitive',
  connector: '=',
  label: 'Primitive de sin et cos',
  levels: ['TermSpé', 'MathComp'],
  sections: ['Primitives', 'Trigonométrie'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getSinCosPrimitive, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getSinCosPrimitivePropositions,
};
