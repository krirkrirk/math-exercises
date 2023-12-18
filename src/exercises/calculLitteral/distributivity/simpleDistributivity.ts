import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
  a: number;
  b: number;
  coeff: number;
};
type VEAProps = {
  a: number;
  b: number;
  coeff: number;
};

const excludeNbrs = [new Integer(-1), new Integer(0), new Integer(1)];
const interval = new Interval('[[-10; 10]]').difference(new DiscreteSet(excludeNbrs));

const getSimpleDistributivityQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const affine = AffineConstructor.random(interval, interval);
  const coeff = interval.getRandomElement()!;

  const statementTree = new MultiplyNode(new NumberNode(coeff.value), affine.toTree());
  const answer = affine.times(coeff.value).toTree().toTex();

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Développer et réduire : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: ['x'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a: affine.a, b: affine.b, coeff: coeff.value },
    veaProps: { a: affine.a, b: affine.b, coeff: coeff.value },
  };
  return question;
};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b, coeff }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const affine = new Affine(a, b);
  tryToAddWrongProp(propositions, new Affine(coeff * a, b).toTree().toTex());
  tryToAddWrongProp(propositions, new Affine(a, coeff * b).toTree().toTex());
  tryToAddWrongProp(propositions, affine.times(-coeff).toTree().toTex());

  while (propositions.length < n) {
    const wrongAnswer = AffineConstructor.random(interval, interval).toTree();
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<VEAProps> = (ans, { a, b, coeff }) => {
  const affine = new Affine(a, b);
  const answerTree = affine.times(coeff).toTree();
  const validLatexs = answerTree.toAllValidTexs();
  return validLatexs.includes(ans);
};

export const simpleDistributivity: MathExercise<QCMProps, VEAProps> = {
  id: 'simpleDistri',
  connector: '=',
  label: 'Distributivité simple',
  levels: ['3ème', '2nde', 'CAP', '2ndPro', '1reTech'],
  sections: ['Calcul littéral'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getSimpleDistributivityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
