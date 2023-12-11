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
import { Integer } from '#root/math/numbers/integer/integer';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';
type QCMProps = {
  answer: string;
  affine1Coeffs: number[];
  affine2Coeffs: number[];
};
type VEAProps = {};

const interval = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)]));

export const getThirdIdentityQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const affine = AffineConstructor.random(interval, interval);
  const affine2 = new Affine(affine.a, -affine.b);
  const statementTree = new MultiplyNode(affine.toTree(), affine2.toTree());
  const answer = affine.multiply(affine2).toTree().toTex();

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Développer et réduire : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: ['x'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, affine1Coeffs: affine.coefficients, affine2Coeffs: affine2.coefficients },
  };
  return question;
};

export const getThirdIdentityPropositions: QCMGenerator<QCMProps> = (n, { answer, affine1Coeffs, affine2Coeffs }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const affine = new Affine(affine1Coeffs[1], affine1Coeffs[0]);
  const affine2 = new Affine(affine2Coeffs[1], affine2Coeffs[0]);
  tryToAddWrongProp(propositions, affine.multiply(affine2.opposite()).toTree().toTex());
  tryToAddWrongProp(propositions, affine.multiply(affine).toTree().toTex());
  tryToAddWrongProp(propositions, affine2.multiply(affine2.opposite()).toTree().toTex());

  while (propositions.length < n) {
    const affineTemp = AffineConstructor.random(interval, interval);
    const affineTemp2 = new Affine(affineTemp.a, -affineTemp.b);
    const wrongAnswer = affineTemp.multiply(affineTemp2).toTree();
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }
  return shuffle(propositions);
};

export const thirdIdentity: MathExercise<QCMProps, VEAProps> = {
  id: 'idRmq3',
  connector: '=',
  label: 'Identité remarquable $(a+b)(a-b)$',
  levels: ['3ème', '2nde'],
  sections: ['Calcul littéral'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getThirdIdentityQuestion, nb),
  getPropositions: getThirdIdentityPropositions,

  qcmTimer: 60,
  freeTimer: 60,
};
