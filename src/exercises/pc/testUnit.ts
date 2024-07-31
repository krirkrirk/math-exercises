import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { MassUnit } from "#root/pc/units/massUnits";
import { Measure } from "#root/pc/measure/measure";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { DistanceUnit } from "#root/pc/units/distanceUnits";

type Identifiers = {};

const two = new NumberNode(2);

const getTestUnitQuestion: QuestionGenerator<Identifiers> = () => {
  const measure1 = new Measure(400, 0, DistanceUnit.m);
  const measure2 = new Measure(200, 0, MassUnit.g);
  const question: Question<Identifiers> = {
    answer: `${randint(1, 100)}`,
    instruction: `$${measure1.divide(measure1).toTex()} $${randint(1, 100)}$`,
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
export const testUnit: Exercise<Identifiers> = {
  id: "testUnit",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getTestUnitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
