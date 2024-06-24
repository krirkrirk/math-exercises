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
import { round } from "#root/math/utils/round";
import { coinFlip } from "#root/utils/coinFlip";
import { random } from "#root/utils/random";
import { requiresApostropheBefore } from "#root/utils/requiresApostropheBefore";
import { getAtoms } from "../utils/getAtoms";

type Identifiers = {
  atomicMass: number;
  atomicNumber: number;
};

const getIdentifyAtomicMassOrAtomicNbQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExercise();
  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: `À l'aide du tableau périodique simplifié, définir ${
      exo.isAsking
    } d'un atome ${requiresApostropheBefore(exo.atom.name) ? "d'" : "de "}${
      exo.atom.name
    }`,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      atomicMass: exo.atomicMasss,
      atomicNumber: exo.atomicNumber,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, atomicMass, atomicNumber },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    +answer === atomicMass ? atomicNumber + "" : atomicMass + "",
  );
  tryToAddWrongProp(
    propositions,
    round(atomicMass + atomicNumber, 2, false) + "",
  );
  while (propositions.length < n) {
    let random = randint(+answer - Math.min(+answer, 5) - 1, +answer + 5, [
      +answer,
    ]);
    tryToAddWrongProp(propositions, round(random, 2, false) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateExercise = () => {
  const atoms = getAtoms(3);
  const atom = random(atoms);
  const isAsking = coinFlip() ? "la masse atomique" : "le nombre atomique";
  return {
    atom,
    isAsking,
    answer:
      isAsking == "la masse atomique"
        ? atom.masseAtomique + ""
        : atom.numeroAtomique + "",
    atomicMasss: atom.masseAtomique,
    atomicNumber: atom.numeroAtomique,
  };
};
export const identifyAtomicMassOrAtomicNb: Exercise<Identifiers> = {
  id: "identifyAtomicMassOrAtomicNb",
  label: "Identifier la masse atomique et le nombre atomique",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Chimie organique"],
  generator: (nb: number) =>
    getDistinctQuestions(getIdentifyAtomicMassOrAtomicNbQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
