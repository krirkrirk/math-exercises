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
import { Measure } from "#root/pc/measure/measure";
import { AmountOfSubstance } from "#root/pc/units/AmountOfSubstance";
import { coinFlip } from "#root/utils/coinFlip";
import { random } from "#root/utils/random";
import { molarQuantity } from "../molarQuantity";

type Identifiers = {};

const reactions = [
  { leftSide: "HCl + NaOH", rightSide: "NaCl + H2O" },
  { leftSide: "CH4 + 2O2", rightSide: "CO2 + 2H2O" },
  { leftSide: "Fe + S", rightSide: "FeS" },
  { leftSide: "Zn + 2HCl", rightSide: "ZnCl2 + H2" },
  { leftSide: "2Na + Cl2", rightSide: "2NaCl" },
  { leftSide: "CaO + H2O", rightSide: "Ca(OH)2" },
  { leftSide: "2H2 + O2", rightSide: "2H2O" },
  { leftSide: "3H2 + N2", rightSide: "2NH3" },
  { leftSide: "C + O2", rightSide: "CO2" },
  { leftSide: "CaCO3 + 2HCl", rightSide: "CaCl2 + H2O + CO2" },
];

const nonStoichiometricReactions = [
  { leftSide: "HCl + 2NaOH", rightSide: "NaCl + NaOH + H2O" },
  { leftSide: "2CH4 + 3O2", rightSide: "CO2 + 2CO + 4H2O" },
  { leftSide: "2Fe + 3S", rightSide: "FeS + FeS2" },
  { leftSide: "Zn + HCl", rightSide: "ZnCl2 + H2" },
  { leftSide: "4Na + Cl2", rightSide: "2NaCl + 2Na" },
  { leftSide: "CaO + 2H2O", rightSide: "Ca(OH)2 + H2O" },
  { leftSide: "H2 + O2", rightSide: "H2O2" },
  { leftSide: "6H2 + N2", rightSide: "2NH3 + 2H2" },
  { leftSide: "2C + O2", rightSide: "2CO" },
  { leftSide: "CaCO3 + HCl", rightSide: "CaCl2 + H2O + CO2 + HCl" },
];

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
  answerType: "QCM",
  subject: "Physique",
};
