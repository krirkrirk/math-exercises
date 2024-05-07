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
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { IntegralNode } from "#root/tree/nodes/functions/IntegralNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {};

const getIntegralTestQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(-10, 10);
  const integrale = new IntegralNode(
    new CosNode(new VariableNode("x")),
    new NumberNode(0),
    new NumberNode(a),
    new VariableNode("x"),
  ).toTex();

  const question: Question<Identifiers> = {
    answer: `${integrale}`,
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
  tryToAddWrongProp(propositions, "ab");
  tryToAddWrongProp(propositions, "bv");
  tryToAddWrongProp(propositions, "dc");

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};
export const integralTest: Exercise<Identifiers> = {
  id: "integralTest",
  label: "Tester si l'intégrale marche",
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
