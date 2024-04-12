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
import { roundSignificant } from "#root/math/utils/round";

type Identifiers = {
  mol: number;
  molarMass: number;
};

const getMolFromMolarMassQuestion: QuestionGenerator<Identifiers> = () => {
  const mol = randfloat(1.1, 4, 1);
  const molarMass = randfloat(10, 50, 1);
  const answer = roundSignificant(mol * molarMass, 1);
  const question: Question<Identifiers> = {
    answer,
    instruction: `On souhaite prélever $${roundSignificant(
      mol,
      1,
    )} \\ \\text{mol}$ d'une espèce chimique de masse molaire $M = ${roundSignificant(
      molarMass,
      1,
    )}\\ \\text{g}\\cdot \\text{mol}^{-1}$. Quelle est la masse $m$ à prélever, en $\\text{g}$ ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { mol, molarMass },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, roundSignificant(randfloat(40, 100, 1), 1));
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const molFromMolarMass: Exercise<Identifiers> = {
  id: "molFromMolarMass",
  connector: "=",
  label: "Calculer une masse en fonction de la quantité de matière",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Mol"],
  generator: (nb: number) =>
    getDistinctQuestions(getMolFromMolarMassQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
