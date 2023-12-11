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
import { Affine } from '#root/math/polynomials/affine';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { random } from '#root/utils/random';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
  coeff: number;
  ineqType: string;
  result: string;
};
type VEAProps = {};

const getFirstDegreeInequationsQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const affine1 = new Affine(randint(-10, 10, [0]), randint(-10, 10));
  const affine2 = new Affine(randint(-10, 10, [0, affine1.a]), randint(-10, 10));

  const result = new Rational(affine2.b - affine1.b, affine1.a - affine2.a).simplify().toTree().toTex();
  const coeff = affine1.a - affine2.a;
  const ineqType = random(['\\le', '<', '\\ge', '>']);
  const invIneqType = ineqType === '<' ? '>' : ineqType === '>' ? '<' : ineqType === '\\le' ? '\\ge' : '\\le';
  const answer = `x${coeff > 0 ? ineqType : invIneqType}${result}`;

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Résoudre l'inéquation : $${affine1.toTex()} ${ineqType} ${affine2.toTex()}$ `,
    keys: ['x', 'sup', 'inf', 'geq', 'leq'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, coeff, ineqType, result },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, coeff, ineqType, result }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const invIneqType = ineqType === '<' ? '>' : ineqType === '>' ? '<' : ineqType === '\\le' ? '\\ge' : '\\le';

  tryToAddWrongProp(propositions, `x${coeff < 0 ? ineqType : invIneqType}${result}`);

  while (propositions.length < n) {
    const wrongAnswer = `x ${coinFlip() ? ineqType : invIneqType} ${randint(-10, 11)}`;

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const firstDegreeInequationsType3: MathExercise<QCMProps, VEAProps> = {
  id: 'firstDegreeInequationsType3',
  connector: '\\iff',
  label: 'Résoudre une inéquation du type $ax+b<cx+d$',
  levels: ['3ème', '2ndPro', '2nde', '1reESM', '1rePro', '1reTech'],
  isSingleStep: true,
  sections: ['Inéquations'],
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeInequationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
