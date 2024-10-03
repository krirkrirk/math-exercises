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
import { AtomSymbols } from "#root/pc/constants/molecularChemistry/atomSymbols";
import { atomes } from "#root/pc/constants/molecularChemistry/atome";
import { random } from "#root/utils/random";
import { requiresApostropheBefore } from "#root/utils/strings/requiresApostropheBefore";

type Identifiers = { atomSymbol: AtomSymbols };

const getAtomicStructureOfNucleusQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const atom = random(atomes.slice(0, 50));
  const mass = round(atom.masseAtomique, 0);
  const instruction = `Le noyau d'un atome  ${
    requiresApostropheBefore(atom.name) ? "d'" : "de "
  }${atom.name} possède $${mass}$ nucléons, $${
    mass - atom.numeroAtomique
  }$ neutrons et $${
    atom.numeroAtomique
  }$ protons. Quelle est son écriture conventionnelle ?`;

  const question: Question<Identifiers> = {
    answer: `^{${mass}}_{${atom.numeroAtomique}}${atom.symbole}`,
    instruction: instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { atomSymbol: atom.symbole },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, atomSymbol },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const atom = atomes.find((a) => a.symbole === atomSymbol)!;
  const mass = round(atom.masseAtomique, 0);
  tryToAddWrongProp(
    propositions,
    `^{${atom.numeroAtomique}}_{${mass}}${atom.symbole}`,
  );
  tryToAddWrongProp(
    propositions,
    `^{${mass}}_{${mass - atom.numeroAtomique}}${atom.symbole}`,
  );
  tryToAddWrongProp(
    propositions,
    `^{${mass + atom.numeroAtomique}}_{${atom.numeroAtomique}}${atom.symbole}`,
  );
  tryToAddWrongProp(
    propositions,
    `^{${mass - atom.numeroAtomique}}_{${atom.numeroAtomique}}${atom.symbole}`,
  );
  // tryToAddWrongProp(
  //   propositions,
  //   `^{${mass}}_{${mass + atom.numeroAtomique}}${atom.symbole}`,
  // );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      `^{${randint(1, 200)}}_{${randint(1, 200)}}${atom.symbole}`,
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === "answer";
};

export const atomicStructureOfNucleus: Exercise<Identifiers> = {
  id: "atomicStructureOfNucleus",
  label: "Trouver l'écriture conventionnelle d'un atome",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Chimie organique"],
  generator: (nb: number) =>
    getDistinctQuestions(getAtomicStructureOfNucleusQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
  answerType: "QCU",
};
