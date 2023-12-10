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
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
  coeffs: number[];
};
type VEAProps = {};
export const getLogarithmePrimitive: QuestionGenerator<QCMProps, VEAProps> = () => {
  const u = PolynomialConstructor.randomWithOrder(randint(1, 3));

  const selectedFunction = new FractionNode(u.derivate().toTree(), u.toTree());
  const integratedFuction = `\\ln\\left|${u.toTex()}\\right|`;
  const answer = `${integratedFuction}+C`;
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la forme générale des primitives de la fonction f définie par $f(x) = ${simplifyNode(
      selectedFunction,
    ).toTex()}$.`,
    startStatement: `F(x)`,
    answer,
    keys: ['x', 'C', 'ln', 'abs'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, coeffs: u.coefficients },
  };

  return question;
};

export const getLogarithmePrimitivePropositions: QCMGenerator<QCMProps> = (n, { answer, coeffs }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const u = new Polynomial(coeffs);
  const wrongIntegrals = [
    new FractionNode(u.derivate().toTree(), new PowerNode(u.toTree(), new NumberNode(2))).toTex(),
    new FractionNode(
      u
        .derivate()
        .multiply(new Polynomial([-1]))
        .toTree(),
      new PowerNode(u.toTree(), new NumberNode(2)),
    ).toTex(),
    `ln(${new PowerNode(u.toTree(), new NumberNode(2)).toTex()})`,
  ];
  while (propositions.length < n) {
    wrongIntegrals.push(
      new PowerNode(u.toTree(), new NumberNode(2)).toTex(),
      `ln\|${PolynomialConstructor.randomWithOrder(randint(1, 3)).toTex()}\|`,
    );
    let wrongIntegral;
    wrongIntegral = wrongIntegrals[randint(0, wrongIntegrals.length)];
    tryToAddWrongProp(propositions, `${wrongIntegral} + C`);
    wrongIntegrals.pop();
  }

  return shuffle(propositions);
};

export const logarithmePrimitive: MathExercise<QCMProps, VEAProps> = {
  id: 'logarithmePrimitive',
  connector: '=',
  label: 'Primitive de la fonction logarithme',
  levels: ['TermSpé', 'MathComp'],
  sections: ['Primitives', 'Logarithme népérien'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getLogarithmePrimitive, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getLogarithmePrimitivePropositions,
};
