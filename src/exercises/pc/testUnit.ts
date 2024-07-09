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
import { MassSiUnitConverter } from "#root/pc/massSiUnitConverter";
import { MassUnit } from "#root/pc/massUnits";
import { Measure } from "#root/pc/measure/measure";

type Identifiers = {};

const getTestUnitQuestion: QuestionGenerator<Identifiers> = () => {
  const measure = new Measure(250, 0, new MassUnit("kg"));
  const measure2 = new Measure(
    50,
    0,
    new MassUnit("kg"),
    new MassSiUnitConverter(),
  );
  const question: Question<Identifiers> = {
    answer: `${randint(1, 100)}`,
    instruction: `$${measure2.times(measure).toTex()}$ ${randint(1, 100)}`,
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
