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
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  a: number;
  b: number;
};

const getFirstDegreeEquationIntQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = 1;
  const b = 3;
  while (b % a != 0) {
    const a = randint(-30, 30, [0]);
    const b = randint(-30, 30, [0]);
  }
  const c = b / a;
  const answer = new EqualNode(new VariableNode("x"), c.toTree()).toTex();
  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Résoudre l'équation suivante : $\\frac{${a}}{x} = ${b}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { a: a, b: b },
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
export const firstDegreeEquationInt: Exercise<Identifiers> = {
  id: "firstDegreeEquationInt",
  label:
    "Résoudre une équation du premier degré du type $\\frac{a}{x} = b$, solution entière",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getFirstDegreeEquationIntQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
