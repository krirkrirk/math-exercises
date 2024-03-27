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
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {};

// m = t*v
// P = m*g
// v = d/t
// U = RI
// F = t_m / t_f
// F = V_f / V_m
// t_m/t_f = V_f/V_m
const formulas = [];
const getIsolateVariablesQuestion: QuestionGenerator<Identifiers> = () => {
  let varAsked = "";
  const formula = randint(1, 8);
  switch (formula) {
    case 1:
      break;
  }
  const question: Question<Identifiers> = {
    answer,
    instruction: `Isoler la grandeur ${varAsked} dans l'expression suivante :`,
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
export const isolateVariables: Exercise<Identifiers> = {
  id: "isolateVariables",
  connector: "",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getIsolateVariablesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
