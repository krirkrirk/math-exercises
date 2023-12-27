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

type Identifiers = {
  type: number;
  a?: number;
  b?: number;
  coefficients?: number[];
  tex?: string;
};

const getUsualDerivative: QuestionGenerator<Identifiers> = () => {
  const type = randint(1, 5);
  let question: Question<any>;
  let identifiers: Identifiers;

  switch (type) {
    case 1:
      question = getFirstDegreeDerivative();
      identifiers = { ...question.identifiers, type: 1 };
      break;
    case 2:
      question = getSecondDegreeDerivative();
      identifiers = { ...question.identifiers, type: 2 };
      break;
    case 3:
      question = getThirdDegreeDerivative();
      identifiers = { ...question.identifiers, type: 3 };
      break;
    case 4:
      question = getConstanteDerivative();
      identifiers = { ...question.identifiers, type: 4 };
      break;
    default:
      throw Error("erreur");
  }
  return { ...question, identifiers };
};

const getPropositions: QCMGenerator<Identifiers> = (
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
const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, type, coefficients, a, b, tex },
) => {
  let valid: boolean;
  switch (type) {
    case 1:
      valid = isFirstDegreeDerivativeAnswerValid(ans, { answer, a: a!, b: b! });
      break;
    case 2:
      valid = isSecondDegreeDerivativeAnswerValid(ans, {
        coefficients: coefficients!,
        answer,
      });
      break;
    case 3:
      valid = isThirdDegreeDerivativeAnswerValid(ans, {
        coefficients: coefficients!,
        answer,
      });
      break;
    case 4:
      valid = isConstanteDerivativeAnswerValid(ans, { answer, tex: tex! });
      break;
    default:
      throw Error("erreur");
  }
  return valid;
};

export const usualDerivative: MathExercise<Identifiers> = {
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
