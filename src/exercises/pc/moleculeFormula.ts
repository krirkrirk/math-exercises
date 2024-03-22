import {
  ScienceExercise,
  Proposition,
  Question,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { molecules } from "#root/exercises/utils/molecularChemistry/molecule";
import { shuffle } from "#root/exercises/utils/shuffle";
import { v4 } from "uuid";

type Identifiers = {
  randomMoleculeIndex: number;
};

const getMoleculeNFormula: QuestionGenerator<Identifiers> = () => {
  const organicMolecule = molecules.filter(
    (molecule) => molecule.isOrganic && molecule.iupact,
  );
  const randomMoleculeIndex = Math.floor(
    Math.random() * organicMolecule.length,
  );
  const myRandomMolecule = organicMolecule[randomMoleculeIndex];

  const instruction = `Donner la formule brute de la molécule suivante : 
  $\\\\$ ![](https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/scienceAssets/molecules/${myRandomMolecule.formula}.png)`;

  const answer = myRandomMolecule.formula;
  const question: Question<Identifiers> = {
    instruction,
    answer,
    keys: [...myRandomMolecule.atoms.map((el) => el.atom.name), "underscore"],
    answerFormat: "tex",
    identifiers: { randomMoleculeIndex },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, randomMoleculeIndex },
) => {
  const organicMolecule = molecules.filter(
    (molecule) => molecule.isOrganic && molecule.iupact,
  );
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const randomMoleculeIndex = Math.floor(
      Math.random() * organicMolecule.length,
    );
    const myRandomMolecule = organicMolecule[randomMoleculeIndex];
    tryToAddWrongProp(propositions, myRandomMolecule.formula);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const moleculeFormula: ScienceExercise<Identifiers> = {
  id: "moleculeFormula",
  connector: "\\iff",
  label:
    "Donner la formule brute d'une molécule à partir de sa formule développée",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Chimie organique"],
  subject: "Chimie",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getMoleculeNFormula, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
