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
import { Measure } from "#root/pc/measure/measure";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";

type Identifiers = {
  order: number;
  multiplier: number;
};
const ten = new NumberNode(10);

const getOrderOfMagnitudeQuestion: QuestionGenerator<Identifiers> = () => {
  const exercise = generateExercise();
  const question: Question<Identifiers> = {
    answer: `${exercise.answer.toTex()}m`,
    instruction: exercise.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { order: exercise.order, multiplier: exercise.multiplier },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, order, multiplier },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(order, multiplier).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generatePropositions = (order: number, multiplier: number): string[] => {
  const correctAnswer = multiplier > 5 ? order + 1 : order;
  const first = new PowerNode(ten, (correctAnswer - 1).toTree()).toTex() + "m";
  const second = new Measure(multiplier, correctAnswer).toTex() + "m";
  const third = new PowerNode(ten, correctAnswer.toTree()).toTex();
  return [first, second, third];
};

const generateExercise = () => {
  const order = randint(-15, -10);
  const multiplier = +randfloat(1, 11).toFixed(1);
  const diameter = new Measure(multiplier, order);
  const answer =
    multiplier > 5
      ? new PowerNode(ten, (order + 1).toTree())
      : new PowerNode(ten, order.toTree());

  const instruction = `Supposons qu'on ait un atome de diamètre $${diameter.toTex()}m$. Indiquez l'ordre de grandeur du diamètre de cet atome.`;

  return {
    answer,
    order,
    diameter,
    multiplier,
    instruction,
  };
};

export const orderOfMagnitude: Exercise<Identifiers> = {
  id: "orderOfMagnitude",
  label: "Calcul d'ordre de grandeur",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Calculs"],
  generator: (nb: number) =>
    getDistinctQuestions(getOrderOfMagnitudeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
