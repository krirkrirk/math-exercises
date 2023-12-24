import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
} from "#root/exercises/exercise";
import {
  getConstantPrimitive,
  getConstantPrimitivePropositions,
  isConstantPrimitiveAnswerValid,
} from "#root/exercises/primitve/constantPrimitive";
import {
  getExponentialPrimitive,
  getExponentialPrimitivePropositions,
  isExponentialPrimitiveAnswerValid,
} from "#root/exercises/primitve/exponentialPrimitive";
import {
  getLogarithmePrimitive,
  getLogarithmePrimitivePropositions,
} from "#root/exercises/primitve/logarithmePrimitive";
import {
  getPolynomialPrimitive,
  getPolynomialPrimitivePropositions,
  isPolynomialPrimitiveAnswerValid,
} from "#root/exercises/primitve/polynomialPrimitive";
import {
  getSinCosPrimitive,
  getSinCosPrimitivePropositions,
  isSinCosPrimitiveAnswerValid,
} from "#root/exercises/primitve/sinCosPrimitive";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
type QCMProps = {
  answer: string;
  type: number;
  a?: number;
  coeffs?: number[];
  isCos?: boolean;
  c?: number;
};
type VEAProps = {
  type: number;
  a?: number;
  coeffs?: number[];
  isCos?: boolean;
  c?: number;
};

const getUsualPrimitives: QuestionGenerator<QCMProps, VEAProps> = () => {
  const rand = randint(1, 5);
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
      question = getSinCosPrimitive();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 3 };
      break;
    case 4:
      question = getExponentialPrimitive();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 4 };
      break;
    default:
      throw Error("erreur");
  }
  return { ...question, qcmGeneratorProps };
};

const getPropositions: QCMGenerator<QCMProps> = (
  n,
  { answer, type, a, c, coeffs, isCos },
) => {
  let props: Proposition[];
  switch (type) {
    case 1:
      props = getConstantPrimitivePropositions(n, { answer, c: c! });
      break;
    case 2:
      props = getPolynomialPrimitivePropositions(n, {
        answer,
        coeffs: coeffs!,
      });
      break;
    case 3:
      props = getSinCosPrimitivePropositions(n, {
        a: a!,
        answer,
        isCos: isCos!,
      });
      break;
    case 4:
      props = getExponentialPrimitivePropositions(n, {
        a: a!,
        answer,
      });
      break;
    default:
      throw Error("erreur");
  }
  return props;
};

const isAnswerValid: VEA<VEAProps> = (ans, { type, a, coeffs, isCos, c }) => {
  let res = false;
  switch (type) {
    case 1:
      res = isConstantPrimitiveAnswerValid(ans, { c: c! });
      break;
    case 2:
      res = isPolynomialPrimitiveAnswerValid(ans, {
        coeffs: coeffs!,
      });
      break;
    case 3:
      res = isSinCosPrimitiveAnswerValid(ans, {
        a: a!,
        isCos: isCos!,
      });
      break;
    case 4:
      res = isExponentialPrimitiveAnswerValid(ans, {
        a: a!,
      });
      break;
    default:
      throw Error("erreur");
  }
  return res;
};

export const usualPrimitives: MathExercise<QCMProps, VEAProps> = {
  id: "usualPrimitives",
  connector: "=",
  label: "Primitives des fonctions de référence",
  levels: ["TermSpé", "MathComp"],
  sections: ["Primitives"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getUsualPrimitives, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
