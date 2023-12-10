import { MathExercise, Proposition, QCMGenerator, Question, QuestionGenerator } from '#root/exercises/exercise';
import { getConstantPrimitive, getConstantPrimitivePropositions } from '#root/exercises/primitve/constantPrimitive';
import {
  getExponentialPrimitive,
  getExponentialPrimitivePropositions,
} from '#root/exercises/primitve/exponentialPrimitive';
import {
  getLogarithmePrimitive,
  getLogarithmePrimitivePropositions,
} from '#root/exercises/primitve/logarithmePrimitive';
import {
  getPolynomialPrimitive,
  getPolynomialPrimitivePropositions,
} from '#root/exercises/primitve/polynomialPrimitive';
import { getSinCosPrimitive, getSinCosPrimitivePropositions } from '#root/exercises/primitve/sinCosPrimitive';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
type QCMProps = {
  answer: string;
  type: number;
  a?: number;
  rand?: boolean;
  coeffs?: number[];
  degree?: number;
};
type VEAProps = {};

const getUsualPrimitives: QuestionGenerator<QCMProps, VEAProps> = () => {
  const rand = randint(1, 6);
  let question: Question<any, any>;
  let qcmGeneratorProps: any;
  switch (rand) {
    case 1:
      question = getConstantPrimitive();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 1 };
      break;
    case 2:
      question = getPolynomialPrimitive();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 2 };
      break;
    case 3:
      question = getLogarithmePrimitive();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 3 };
      break;
    case 4:
      question = getSinCosPrimitive();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 4 };
      break;
    case 5:
      question = getExponentialPrimitive();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 5 };
      break;
    default:
      throw Error('erreur');
  }
  return { ...question, qcmGeneratorProps };
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, type, a, degree, coeffs, rand }) => {
  let props: Proposition[];
  switch (type) {
    case 1:
      props = getConstantPrimitivePropositions(n, { answer });
      break;
    case 2:
      props = getPolynomialPrimitivePropositions(n, { answer, degree: degree! });
      break;
    case 3:
      props = getLogarithmePrimitivePropositions(n, { answer, coeffs: coeffs! });
      break;
    case 4:
      props = getSinCosPrimitivePropositions(n, { a: a!, answer, coeffs: coeffs!, rand: rand! });
      break;
    case 5:
      props = getExponentialPrimitivePropositions(n, { a: a!, answer, coeffs: coeffs!, rand: rand! });
      break;
    default:
      throw Error('erreur');
  }
  return props;
};

export const usualPrimitives: MathExercise<QCMProps, VEAProps> = {
  id: 'usualPrimitives',
  connector: '=',
  label: 'Primitives des fonctions de référence',
  levels: ['TermSpé', 'MathComp'],
  sections: ['Primitives'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getUsualPrimitives, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
