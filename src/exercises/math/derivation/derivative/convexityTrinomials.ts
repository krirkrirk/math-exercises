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

type Identifiers = {
  coeffs: number[];
};

const getConvexityTrinomialsQuestion: QuestionGenerator<Identifiers> = () => {
  const trinom = TrinomConstructor.random();

  const isConvex = trinom.a > 0 ? "Convexe" : "Concave";

  const question: Question<Identifiers> = {
    answer: isConvex,
    instruction: `Soit la fonction $f(x) = ${trinom.toTex()}$. Sur $\\mathbb{R}$, $f$ est :`,
    keys: [],
    answerFormat: "raw",
    identifiers: { coeffs: trinom.coefficients },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");

  tryToAddWrongProp(propositions, "Concave", "raw");
  tryToAddWrongProp(propositions, "Convexe", "raw");
  tryToAddWrongProp(propositions, "Ni concave, ni convexe", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};
export const convexityTrinomials: Exercise<Identifiers> = {
  id: "convexityTrinomials",
  label: "Déterminer la convexité d'un trinôme",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getConvexityTrinomialsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "QCM",
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
