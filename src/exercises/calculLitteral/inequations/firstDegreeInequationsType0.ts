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
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { coinFlip } from '#root/utils/coinFlip';
import { random } from '#root/utils/random';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  a: number;
  ineqType: string;
  result: number;
};
type VEAProps = {};
const getFirstDegreeInequationsQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const affine = new Affine(1, randint(-10, 11));
  const c = randint(-10, 11);

  const result = c - affine.b;

  const ineqType = random(['\\le', '<', '\\ge', '>']);
  const answer = `x${ineqType}${result}`;

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Résoudre l'inéquation : $${affine.toTex()} ${ineqType} ${c}$ `,
    keys: ['x', 'sup', 'inf', 'geq', 'leq'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a: affine.a, ineqType, result },
  };

  return question;
};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, ineqType, result }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const invIneqType = ineqType === '<' ? '>' : ineqType === '>' ? '<' : ineqType === '\\le' ? '\\ge' : '\\le';

  tryToAddWrongProp(propositions, `x${a < 0 ? ineqType : invIneqType}${result}`);
  while (propositions.length < n) {
    const wrongAnswer = `x${coinFlip() ? ineqType : invIneqType}${randint(-10, 11)}`;

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const firstDegreeInequationsType0: MathExercise<QCMProps, VEAProps> = {
  id: 'firstDegreeInequationsType0',
  connector: '\\iff',
  label: 'Résoudre une inéquation du type $x+b<c$',
  levels: ['3ème', '2ndPro', '2nde', '1reESM', '1rePro', '1reTech'],
  isSingleStep: true,
  sections: ['Inéquations'],
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeInequationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
