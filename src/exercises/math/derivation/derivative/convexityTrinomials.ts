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

const getConvexityTrinomialsQuestion: QuestionGenerator<Identifiers> = () => {
  const trinom = TrinomConstructor.random();

  const isConvex = trinom.a > 0 ? "Convexe" : "Concave";

  const question: Question<Identifiers> = {
    answer: isConvex,
    instruction: `Soit la fonction f(x) = ${trinom.toTex()}. Est-elle :`,
    keys: [],
    answerFormat: "raw",
    identifiers: { trinom },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, "Concave");
  tryToAddWrongProp(propositions, "Convexe");
  tryToAddWrongProp(propositions, "Ni l'un ni l'autre");
  tryToAddWrongProp(propositions, "On ne peut pas savoir");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};
export const convexityTrinomials: Exercise<Identifiers> = {
  id: "convexityTrinomials",
  label: "Convexité des fonctions quadratiques",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getConvexityTrinomialsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "QCM",
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
