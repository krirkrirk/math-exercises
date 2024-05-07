import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { AffineConstructor } from "#root/math/polynomials/affine";
import { TrinomConstructor } from "#root/math/polynomials/trinom";

type Identifiers = {
  a: number;
  b: number;
  lowerBound: number;
  upperBound: number;
};

const getIntegralAffinesQuestion: QuestionGenerator<Identifiers> = () => {
  const trinomial = TrinomConstructor.random();
  const affine = trinomial.derivate();

  const question: Question<Identifiers> = {
    answer: tri,
    instruction: ``,
    keys: [],
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};
export const integralAffines: Exercise<Identifiers> = {
  id: "integralAffines",
  connector: "",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getIntegralAffinesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
