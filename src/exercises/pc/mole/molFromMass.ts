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

type Identifiers = {
  mass: number;
  molarMass: number;
};

const getMolFromMassQuestion: QuestionGenerator<Identifiers> = () => {
  const mass = randfloat(5, 100, 1);
  const molarMass = randfloat(5, 50, 1);
  const answer = roundSignificant(mass / molarMass, 1);
  const question: Question<Identifiers> = {
    answer,
    instruction: `On prélève $${roundSignificant(
      mass,
      1,
    )}\\ \\text{g}$ d'une espèce chimique de masse molaire $${roundSignificant(
      molarMass,
      1,
    )}\\ \\text{g}\\cdot \\text{mol}^{-1}$. Quelle est la quantité de matière prélevée, en $\\text{mol}$ ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { mass, molarMass },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, roundSignificant(randfloat(1, 10, 1), 1));
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const molFromMass: Exercise<Identifiers> = {
  id: "molFromMass",
  connector: "=",
  label: "Calculer une quantité de matière en fonction de la masse",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Mol"],
  generator: (nb: number) => getDistinctQuestions(getMolFromMassQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
