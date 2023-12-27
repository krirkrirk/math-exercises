import {
  MathExercise,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { random } from "#root/utils/random";
import {
  getFirstIdentityPropositions,
  getFirstIdentityQuestion,
  isFirstIdentityAnswerValid,
} from "./firstIdentity";
import {
  getSecondIdentityPropositions,
  getSecondIdentityQuestion,
  isSecondIdentityAnswerValid,
} from "./secondIdentity";
import {
  getThirdIdentityPropositions,
  getThirdIdentityQuestion,
  isThirdIdentityAnswerValid,
} from "./thirdIdentity";
type Identifiers = {
  type: number;
  a?: number;
  b?: number;
  affine1Coeffs?: number[];
  affine2Coeffs?: number[];
};

const getAllIdentitiesQuestion: QuestionGenerator<Identifiers> = () => {
  const type = random([1, 2, 3]);
  let question: Question<any>;
  let identifiers: Identifiers;
  switch (type) {
    case 1:
      question = getFirstIdentityQuestion();
      identifiers = { ...question.identifiers, type: 1 };
      break;
    case 2:
      question = getSecondIdentityQuestion();
      identifiers = { ...question.identifiers, type: 2 };
      break;
    case 3:
    default:
      question = getThirdIdentityQuestion();
      identifiers = { ...question.identifiers, type: 3 };
      break;
  }
  return { ...question, identifiers };
};
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, type, a, b, affine1Coeffs, affine2Coeffs },
) => {
  switch (type) {
    case 1:
      return getFirstIdentityPropositions(n, { a: a!, answer, b: b! });
    case 2:
      return getSecondIdentityPropositions(n, { a: a!, answer, b: b! });
    case 3:
    default:
      return getThirdIdentityPropositions(n, {
        affine1Coeffs: affine1Coeffs!,
        affine2Coeffs: affine2Coeffs!,
        answer,
      });
  }
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { type, a, b, affine1Coeffs, affine2Coeffs, answer },
) => {
  switch (type) {
    case 1:
      return isFirstIdentityAnswerValid(ans, { answer, a: a!, b: b! });
    case 2:
      return isSecondIdentityAnswerValid(ans, { answer, a: a!, b: b! });
    case 3:
    default:
      return isThirdIdentityAnswerValid(ans, {
        answer,
        affine1Coeffs: affine1Coeffs!,
        affine2Coeffs: affine2Coeffs!,
      });
  }
};

export const allIdentities: MathExercise<Identifiers> = {
  id: "allIdRmq",
  connector: "=",
  label: "Identités remarquables (toutes)",
  levels: ["3ème", "2nde", "1reTech"],
  sections: ["Calcul littéral"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getAllIdentitiesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
