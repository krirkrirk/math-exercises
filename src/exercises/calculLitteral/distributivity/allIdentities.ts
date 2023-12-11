import { MathExercise, QCMGenerator, Question, QuestionGenerator } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { random } from '#root/utils/random';
import { getFirstIdentityPropositions, getFirstIdentityQuestion } from './firstIdentity';
import { getSecondIdentityPropositions, getSecondIdentityQuestion } from './secondIdentity';
import { getThirdIdentityPropositions, getThirdIdentityQuestion } from './thirdIdentity';
type QCMProps = {
  answer: string;
  type: number;
  a?: number;
  b?: number;
  affine1Coeffs?: number[];
  affine2Coeffs?: number[];
};
type VEAProps = {};

const getAllIdentitiesQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const type = random([1, 2, 3]);
  let question: Question<any, any>;
  let qcmGeneratorProps: QCMProps;
  switch (type) {
    case 1:
      question = getFirstIdentityQuestion();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 1 };
      break;
    case 2:
      question = getSecondIdentityQuestion();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 2 };
      break;
    case 3:
    default:
      question = getThirdIdentityQuestion();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 3 };
      break;
  }
  return { ...question, qcmGeneratorProps };
};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer, type, a, b, affine1Coeffs, affine2Coeffs }) => {
  switch (type) {
    case 1:
      return getFirstIdentityPropositions(n, { a: a!, answer, b: b! });
    case 2:
      return getSecondIdentityPropositions(n, { a: a!, answer, b: b! });
    case 3:
    default:
      return getThirdIdentityPropositions(n, { affine1Coeffs: affine1Coeffs!, affine2Coeffs: affine2Coeffs!, answer });
  }
};

export const allIdentities: MathExercise<QCMProps, VEAProps> = {
  id: 'allIdRmq',
  connector: '=',
  label: 'Identités remarquables (toutes)',
  levels: ['3ème', '2nde', '1reTech'],
  sections: ['Calcul littéral'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getAllIdentitiesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
