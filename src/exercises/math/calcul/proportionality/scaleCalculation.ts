import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { DistanceUnit } from "#root/pc/units/distanceUnits";

type Identifiers = {};

const getScaleCalculationQuestion: QuestionGenerator<Identifiers> = () => {
  const realDistance = randint(1, 100);
  const fakeDistance = randint(1, 100);
  const km = DistanceUnit.km;
  const m = DistanceUnit.m;
  const instruction = `La distance entre deux villes est de $${realDistance}${km.toTex()}$. Sur une carte, cette distance mesure $${fakeDistance}${m.toTex()}$. Quelle est l'échelle de la carte ?`;
  const question: Question<Identifiers> = {
    answer: "a",
    instruction,
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

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  throw Error("GGBVea not implemented");
};
export const scaleCalculation: Exercise<Identifiers> = {
  id: "scaleCalculation",
  connector: "=",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getScaleCalculationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  isGGBAnswerValid,
  subject: "Mathématiques",
};
