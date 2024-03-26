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
import { AtomSymbols } from "#root/pc/molecularChemistry/atomSymbols";
import { Atome, atomes } from "#root/pc/molecularChemistry/atome";
import { random } from "#root/utils/random";

type AtomicStructureElement = "proton" | "neutron" | "electron";

const possibleElements: AtomicStructureElement[] = [
  "proton",
  "neutron",
  "electron",
];

type Identifiers = {
  atomSymbol: AtomSymbols;
  elementToFind: AtomicStructureElement;
};

const getFindAtomicStructureElementQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const atom = random(atomes);
  const elementToFind = possibleElements[randint(0, 2)];
  const instruction = `L'écriture conventionnelle du noyau d'un atome de ${
    atom.name
  } est $^{${round(atom.masseAtomique, 0)}}_{${atom.numeroAtomique}}${
    atom.symbole
  }$ . Quel est le nombre ${
    elementToFind === "proton"
      ? "de protons"
      : elementToFind === "neutron"
      ? "de neutrons"
      : "d'électrons"
  } de l'atome de ${atom.name}?`;

  const protonsNumber = atom.numeroAtomique;
  // const electronsNumber = protonsNumber;
  const neutronsNumber = round(atom.masseAtomique, 0) - protonsNumber;
  const answer = elementToFind === "neutron" ? neutronsNumber : protonsNumber;

  const question: Question<Identifiers> = {
    answer: `${answer}`,
    instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { atomSymbol: atom.symbole, elementToFind },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, atomSymbol, elementToFind },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const atom = atomes.find((a) => a.symbole === atomSymbol)!;
  const protonsNumber = atom.numeroAtomique;
  const electronsNumber = protonsNumber;
  const neutronsNumber = round(atom.masseAtomique, 0) - protonsNumber;

  tryToAddWrongProp(propositions, `${protonsNumber}`);
  tryToAddWrongProp(propositions, `${electronsNumber}`);
  tryToAddWrongProp(propositions, `${neutronsNumber}`);
  tryToAddWrongProp(propositions, `${round(atom.masseAtomique, 0)}`);
  tryToAddWrongProp(
    propositions,
    `${atom.numeroAtomique + round(atom.masseAtomique, 0)}`,
  );
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, `${randint(0, 200)}`);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const findAtomicStructureElement: Exercise<Identifiers> = {
  id: "findAtomicStructureElement",
  label: "Trouver le nombre de protons, neutrons ou électrons d'un atome",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Chimie organique"], //TODO change
  generator: (nb: number) =>
    getDistinctQuestions(getFindAtomicStructureElementQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
