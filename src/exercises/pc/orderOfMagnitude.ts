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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";

type Identifiers = {};

const getOrderOfMagnitudeQuestion: QuestionGenerator<Identifiers> = () => {
  const question: Question<Identifiers> = {
    answer,
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

const generateExercise = () => {
  const order = randint(-20, -11);
  const diameter = new MultiplyNode(
    new NumberNode(+randfloat(1, 6).toFixed(2)),
    new PowerNode((10).toTree(), order.toTree()),
  );

  const instruction = `Supposons qu'on es un atome de diametre ${diameter},indiquer l'ordre de grandeur du diamètre de cet atome.`;
};

export const orderOfMagnitude: Exercise<Identifiers> = {
  id: "orderOfMagnitude",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getOrderOfMagnitudeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
