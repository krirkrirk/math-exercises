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
import { molecules } from "#root/pc/molecularChemistry/molecule";
import { random } from "#root/utils/random";
import { requiresApostropheBefore } from "#root/utils/requiresApostropheBefore";

type Identifiers = {};

const getMolarMassQuestion: QuestionGenerator<Identifiers> = () => {
  const molecule = random(
    molecules.slice(0, 50).filter((m) => m.atoms.length > 1),
  );
  const article = requiresApostropheBefore(molecule.name) ? "de l'" : "du ";
  const weight = molecule.atoms.reduce(
    (acc, curr) => acc + curr.count * round(curr.atom.masseAtomique, 1),
    0,
  );
  const question: Question<Identifiers> = {
    answer: roundSignificant(weight, 1),
    instruction: `Calculer la masse molaire ${article}${molecule.name.toLocaleLowerCase()} $${
      molecule.formula
    }$.`,
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
    tryToAddWrongProp(propositions, roundSignificant(randfloat(10, 100, 1), 1));
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const molarMass: Exercise<Identifiers> = {
  id: "molarMass",
  connector: "=",
  label: "Calculer une masse molaire",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Mol"],
  generator: (nb: number) => getDistinctQuestions(getMolarMassQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
