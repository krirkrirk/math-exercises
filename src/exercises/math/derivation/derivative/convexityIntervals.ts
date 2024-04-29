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
import { TrinomConstructor } from "#root/math/polynomials/trinom";

type Identifiers = {};

const getConvexityIntervalsQuestion: QuestionGenerator<Identifiers> = () => {
  const trinom = TrinomConstructor.random();

  const isConvex = trinom.a > 0 ? "convexe" : "concave";
  const interval = "]-∞, +∞[";

  const question: Question<Identifiers> = {
    answer: interval,
    instruction: `Déterminer sur quel intervalle la fonction f(x) = ${trinom.toTex()} est ${isConvex}.`,
    keys: ["lbracket", "rbracket", "infty"],
    answerFormat: "raw",
    identifiers: { trinom },
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
export const convexityIntervals: Exercise<Identifiers> = {
  id: "convexityIntervals",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getConvexityIntervalsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
