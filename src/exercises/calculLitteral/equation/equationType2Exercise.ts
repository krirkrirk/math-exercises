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
import { Rational } from '#root/math/numbers/rationals/rational';
import { Affine } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { randint } from '#root/math/utils/random/randint';
import { EqualNode } from '#root/tree/nodes/operators/equalNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

/**
 *  type ax=b
 */
type QCMProps = {
  answer: string;
  a: number;
  b: number;
};
type VEAProps = {};

const getEquationType2ExerciseQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const interval = new Interval('[[-10; 10]]');
  const b = interval.getRandomElement();
  const a = randint(-9, 10, [0, 1]);
  const solution = new Rational(b.value, a).simplify();
  const affine = new Affine(a, 0).toTree();
  const tree = new EqualNode(affine, b.toTree());
  const answer = new EqualNode(new VariableNode('x'), solution.toTree()).toTex();

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Résoudre : $${tree.toTex()}$`,
    startStatement: tree.toTex(),
    answer,
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a, b: b.value },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongAnswer = new Rational(b + randint(-7, 8, [0, -b]), a + randint(-7, 8, [-a, 0])).simplify();
    tryToAddWrongProp(propositions, new EqualNode(new VariableNode('x'), wrongAnswer.toTree()).toTex());
  }

  return shuffle(propositions);
};

export const equationType2Exercise: MathExercise<QCMProps, VEAProps> = {
  id: 'equa2',
  connector: '\\iff',
  label: 'Équations $ax=b$',
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1rePro', '1reTech'],
  sections: ['Équations'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getEquationType2ExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
