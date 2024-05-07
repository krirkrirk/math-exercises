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
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { IntegralNode } from "#root/tree/nodes/functions/IntegralNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {};

const integrale = new IntegralNode(
  new CosNode(new NumberNode(4)),
  0,
  1,
  new VariableNode("x"),
);

const getIntegralTestQuestion: QuestionGenerator<Identifiers> = () => {
  const question: Question<Identifiers> = {
    answer: integrale.toTex(),
    instruction: `Test affichage integrale :`,
    keys: [],
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  addValidProp(propositions, answer);
  addValidProp(propositions, answer);
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};
export const integralTest: Exercise<Identifiers> = {
  id: "integralTest",
  label: "Test",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Intégration"],
  generator: (nb: number) => getDistinctQuestions(getIntegralTestQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
