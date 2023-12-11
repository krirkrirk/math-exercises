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
import { NumberType } from '#root/math/numbers/nombre';
import { PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { GeometricSequenceConstructor } from '#root/math/sequences/geometricSequence';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  reason: string;
  firstTerm: string;
};
type VEAProps = {};
const getSequenceGeometricLimitQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const sequence = GeometricSequenceConstructor.randomWithLimit();
  const to = '+\\infty';
  const answer = sequence.getLimit();
  if (!answer) throw Error('received geometric sequence with no limit');

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Déterminer la limite de la suite $u$ définie par : $u_n = ${sequence.toTree().toTex()}$.`,
    keys: ['infty'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, reason: sequence.reason.tex, firstTerm: sequence.firstTerm.tex },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, reason, firstTerm }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, '+\\infty');
  tryToAddWrongProp(propositions, '-\\infty');
  tryToAddWrongProp(propositions, '0');
  tryToAddWrongProp(propositions, reason + '');
  tryToAddWrongProp(propositions, firstTerm + '');

  return shuffleProps(propositions, n);
};

export const sequenceGeometricLimit: MathExercise<QCMProps, VEAProps> = {
  id: 'sequenceGeometricLimit',
  connector: '=',
  label: "Limite d'une suite géométrique",
  levels: ['TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Limites', 'Suites'],
  generator: (nb: number) => getDistinctQuestions(getSequenceGeometricLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
