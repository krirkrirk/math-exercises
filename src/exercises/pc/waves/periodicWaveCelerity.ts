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
import { round, roundSignificant } from "#root/math/utils/round";
import { random } from "#root/utils/random";

type Identifiers = {
  v: number;
  l: number;
  T: number;
};

// v = lambda / t
const getPeriodicWaveCelerityQuestion: QuestionGenerator<Identifiers> = () => {
  const varAsked = random(["v", "T", "l"]);
  let v: number;
  let T: number;
  let l: number;
  let instruction = "";
  let answer = "";
  switch (varAsked) {
    case "v":
      T = randfloat(1, 10, 1);
      l = randfloat(1, 10, 1);
      v = round(l / T, 1);
      instruction = `Une onde périodique a une longueur d'onde de $${roundSignificant(
        l,
        1,
      )}\\ \\text{m}$ et une période de $${roundSignificant(
        T,
        1,
      )}\\ \\text{s}$. Quelle est sa célérité ?`;
      answer = roundSignificant(v, 1);
      break;

    case "T":
      l = randfloat(1, 10, 1);
      v = randfloat(1, 10, 1);
      T = round(l / v, 1);
      instruction = `Une onde périodique a une longueur d'onde de $${roundSignificant(
        l,
        1,
      )}\\ \\text{m}$ et une célérité de $${roundSignificant(
        v,
        1,
      )}\\ \\text{m}\\cdot\\text{s}^{-1}$. Quelle est sa période ?`;
      answer = roundSignificant(T, 1);
      break;
    case "l":
    default:
      v = randfloat(1, 10, 1);
      T = randfloat(1, 10, 1);
      l = round(v * T, 1);
      instruction = `Une onde périodique a une période de $${roundSignificant(
        T,
        1,
      )}\\ \\text{m}$ et une célérité de $${roundSignificant(
        v,
        1,
      )}\\ \\text{m}\\cdot\\text{s}^{-1}$. Quelle est sa longueur d'onde ?`;
      answer = roundSignificant(T, 1);
      break;
  }
  const question: Question<Identifiers> = {
    answer,
    instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { v, T, l },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, roundSignificant(randfloat(1, 20, 1), 1));
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const periodicWaveCelerity: Exercise<Identifiers> = {
  id: "periodicWaveCelerity",
  connector: "=",
  label: "Célérité d'une onde periodique",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Ondes"],
  generator: (nb: number) =>
    getDistinctQuestions(getPeriodicWaveCelerityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
