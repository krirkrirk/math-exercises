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
import { MassUnit } from "#root/pc/units/massUnits";
import { Measure } from "#root/pc/measure/measure";
import { DistanceUnit } from "#root/pc/units/distanceUnits";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { earthG } from "#root/pc/constants/gravity";
import { PowerUnit } from "#root/pc/units/powerUnits";
import { MultiplyUnit } from "#root/pc/units/mulitplyUnits";
import { TimeUnit } from "#root/pc/units/timeUnits";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";

type Identifiers = {};

const two = new NumberNode(2);

const getTestUnitQuestion: QuestionGenerator<Identifiers> = () => {
  const measure1 = new Measure(
    1,
    0,
    new MultiplyUnit(new PowerUnit(MassUnit.g, two), TimeUnit.s),
  );

  const measure2 = new Measure(2, 0, new PowerUnit(MassUnit.g, two));
  const measure3 = new Measure(2, 0, new PowerUnit(DistanceUnit.m, two));
  const measure4 = new Measure(
    1,
    0,
    new MultiplyUnit(MassUnit.kg, MassUnit.kg),
  );

  console.log(measure4.divide(measure3).toTex());

  const question: Question<Identifiers> = {
    answer: `${randint(1, 100)}`,
    instruction: `$${measure1
      .divide(measure2)
      .times(earthG.measure)
      .times(measure4)
      .divide(measure3)
      .divide(measure1)
      .toTex()}$${randint(1, 100)}$`,
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
