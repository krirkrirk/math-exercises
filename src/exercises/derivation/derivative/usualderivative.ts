import { randint } from "#root/math/utils/random/randint";
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";
import {
  getConstanteDerivative,
  getConstanteDerivativePropositions,
  isConstanteDerivativeAnswerValid,
} from "./constanteDerivative";
import {
  getFirstDegreeDerivative,
  getFirstDegreeDerivativePropositions,
  isFirstDegreeDerivativeAnswerValid,
} from "./firstDegreeDerivative";
import {
  getSecondDegreeDerivative,
  getSecondDegreeDerivativePropositions,
  isSecondDegreeDerivativeAnswerValid,
} from "./secondDegreeDerivative";
import {
  getThirdDegreeDerivative,
  getThirdDegreeDerivativePropositions,
  isThirdDegreeDerivativeAnswerValid,
} from "./thirdDegreeDerivative";

type QCMProps = {
  answer: string;
  type: number;
  a?: number;
  b?: number;
  coefficients?: number[];
  tex?: string;
};
type VEAProps = {
  answer: string;
  type: number;
  coefficients?: number[];
};

const getUsualDerivative: QuestionGenerator<QCMProps, VEAProps> = () => {
  const type = randint(1, 5);
  let question: Question<any, any>;
  let qcmGeneratorProps: QCMProps;

  switch (type) {
    case 1:
      question = getFirstDegreeDerivative();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 1 };
      break;
    case 2:
      question = getSecondDegreeDerivative();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 2 };
      break;
    case 3:
      question = getThirdDegreeDerivative();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 3 };
      break;
    case 4:
      question = getConstanteDerivative();
      qcmGeneratorProps = { ...question.qcmGeneratorProps, type: 4 };
      break;
    default:
      throw Error("erreur");
  }
  return { ...question, qcmGeneratorProps };
};

const getPropositions: QCMGenerator<QCMProps> = (
  n,
  { answer, type, a, b, coefficients, tex },
) => {
  let props: Proposition[];
  switch (type) {
    case 1:
      props = getFirstDegreeDerivativePropositions(n, { a: a!, answer, b: b! });
      break;
    case 2:
      props = getSecondDegreeDerivativePropositions(n, {
        answer,
        coefficients: coefficients!,
      });
      break;
    case 3:
      props = getThirdDegreeDerivativePropositions(n, {
        answer,
        coefficients: coefficients!,
      });
      break;
    case 4:
      props = getConstanteDerivativePropositions(n, { answer, tex: tex! });
      break;

    default:
      throw Error("erreur");
  }
  return props;
};
const isAnswerValid: VEA<VEAProps> = (ans, { answer, type, coefficients }) => {
  let valid: boolean;
  switch (type) {
    case 1:
      valid = isFirstDegreeDerivativeAnswerValid(ans, { answer });
      break;
    case 2:
      valid = isSecondDegreeDerivativeAnswerValid(ans, {
        coefficients: coefficients!,
      });
      break;
    case 3:
      valid = isThirdDegreeDerivativeAnswerValid(ans, {
        coefficients: coefficients!,
      });
      break;
    case 4:
      valid = isConstanteDerivativeAnswerValid(ans, {});
      break;
    default:
      throw Error("erreur");
  }
  return valid;
};

export const usualDerivative: MathExercise<QCMProps, VEAProps> = {
  id: "usualDerivative",
  connector: "=",
  label: "Dérivées des fonctions de référence",
  levels: [
    "1reESM",
    "1reSpé",
    "1reTech",
    "MathComp",
    "1rePro",
    "TermPro",
    "TermTech",
  ],
  sections: ["Dérivation"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getUsualDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
