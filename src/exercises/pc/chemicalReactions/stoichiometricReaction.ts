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
import { Measure } from "#root/pc/measure/measure";
import { AmountOfSubstance } from "#root/pc/units/AmountOfSubstance";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {};

const getStoichiometricReactionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = genearteExercise();

  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: exo.instruction,
    keys: [],
    answerFormat: "raw",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui.", "raw");
  tryToAddWrongProp(propositions, "Non.", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir.", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const genearteExercise = () => {
  const answer = coinFlip() ? "Oui." : "Non.";
  const a = randint(2, 9);
  const b = randint(2, 9);
  const c = randint(2, 9);
  const d = randint(2, 9);
  const nA = answer === "Oui." ? a * randint(2, 5) : a * randint(2, 6);
  const nB = answer === "Oui." ? b * (nA / a) : b * randint(6, 11);
  const nAMeasure = new Measure(nA, 0, AmountOfSubstance.mol);
  const nBMeasure = new Measure(nB, 0, AmountOfSubstance.mol);
  const nCMeasure = new Measure(randint(2, 20), 0, AmountOfSubstance.mol);
  const nDMeasure = new Measure(randint(2, 20), 0, AmountOfSubstance.mol);
  const instruction = `Soit la réaction chimique, $${a}A + ${b}B \\rightarrow ${c}C + ${d}D$. Déterminer si elle est stochiométrique, en sachant :
  - $n(A) = ${nAMeasure.toTex({ notScientific: true })}$
  - $n(B) = ${nBMeasure.toTex({ notScientific: true })}$
  - $n(C) = ${nCMeasure.toTex({ notScientific: true })}$
  - $n(D) = ${nDMeasure.toTex({ notScientific: true })}$`;

  return {
    instruction,
    answer,
    nA,
    nB,
  };
};

export const stoichiometricReaction: Exercise<Identifiers> = {
  id: "stoichiometricReaction",
  label: "Déterminer si une réaction est stochiométrique",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Réaction chimique"],
  generator: (nb: number) =>
    getDistinctQuestions(getStoichiometricReactionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCU",
  subject: "Physique",
};
