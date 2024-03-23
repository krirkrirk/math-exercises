import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
} from "#root/exercises/exercise";

import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import {
  getConstantPrimitive,
  getConstantPrimitivePropositions,
  isConstantPrimitiveAnswerValid,
} from "./constantPrimitive";
import {
  getExponentialPrimitive,
  getExponentialPrimitivePropositions,
  isExponentialPrimitiveAnswerValid,
} from "./exponentialPrimitive";
import {
  getPolynomialPrimitive,
  getPolynomialPrimitivePropositions,
  isPolynomialPrimitiveAnswerValid,
} from "./polynomialPrimitive";
import {
  getSinCosPrimitive,
  getSinCosPrimitivePropositions,
  isSinCosPrimitiveAnswerValid,
} from "./sinCosPrimitive";
type Identifiers = {
  type: number;
  a?: number;
  coeffs?: number[];
  isCos?: boolean;
  c?: number;
};

const getUsualPrimitives: QuestionGenerator<Identifiers> = () => {
  const rand = randint(1, 5);
  let question: Question<any>;
  let identifiers: any;
  switch (rand) {
    case 1:
      question = getConstantPrimitive();
      identifiers = { ...question.identifiers, type: 1 };
      break;
    case 2:
      question = getPolynomialPrimitive();
      identifiers = { ...question.identifiers, type: 2 };
      break;
    case 3:
      question = getSinCosPrimitive();
      identifiers = { ...question.identifiers, type: 3 };
      break;
    case 4:
      question = getExponentialPrimitive();
      identifiers = { ...question.identifiers, type: 4 };
      break;
    default:
      throw Error("erreur");
  }
  return { ...question, identifiers };
};

const getPropositions: QCMGenerator<Identifiers> = (
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

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { type, a, coeffs, isCos, c, answer },
) => {
  let res = false;
  switch (type) {
    case 1:
      res = isConstantPrimitiveAnswerValid(ans, { c: c!, answer });
      break;
    case 2:
      res = isPolynomialPrimitiveAnswerValid(ans, {
        coeffs: coeffs!,
        answer,
      });
      break;
    case 3:
      res = isSinCosPrimitiveAnswerValid(ans, {
        a: a!,
        isCos: isCos!,
        answer,
      });
      break;
    case 4:
      res = isExponentialPrimitiveAnswerValid(ans, {
        a: a!,
        answer,
      });
      break;
    default:
      throw Error("erreur");
  }
  return res;
};

export const usualPrimitives: Exercise<Identifiers> = {
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
  subject: "Mathématiques",
};
