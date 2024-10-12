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
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  GetGGBOptions,
  GetStudentGGBOptions,
  GetGGBAnswer,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randfloat } from "#root/math/utils/random/randfloat";
import { round } from "#root/math/utils/round";
import { euroParser } from "#root/tree/parsers/euroParser";

type Identifiers = {
  vf: number;
  percentRate: number;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, percentRate, vf },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const invCm = 1 - percentRate / 100;

  tryToAddWrongProp(propositions, round(vf * invCm, 2).frenchify() + "€");
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      round(randfloat(1, 100, 2), 2).frenchify() + "€",
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const cm = 1 + identifiers.percentRate / 100;
  const vd = round(identifiers.vf / cm, 2);
  return vd.frenchify() + "€";
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const evolution = identifiers.percentRate < 0 ? "baisse" : "hausse";
  return `Après une ${evolution} de $${identifiers.percentRate.frenchify()}\\%$, le prix d'un objet est de $${identifiers.vf.frenchify()}€$. Quel était son prix initial ? Arrondir au centième.`;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["euro"];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return euroParser(ans) === answer;
};

const getFindStartValueAfterEvolutionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const vf = randfloat(1, 100, 2);
  const percentRate = randfloat(-100, 100, 2, [0]);
  const identifiers: Identifiers = {
    vf,
    percentRate,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
  };

  return question;
};

export const findStartValueAfterEvolution: Exercise<Identifiers> = {
  id: "findStartValueAfterEvolution",
  connector: "=",
  label:
    "Retrouver un prix initial à partir du prix final et du taux d'évolution",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getFindStartValueAfterEvolutionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getAnswer,
};
