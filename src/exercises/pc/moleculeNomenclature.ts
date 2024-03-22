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

type Identifiers = {
  randomMoleculeIndex: number;
};

const getMoleculeNomenclature: QuestionGenerator<Identifiers> = () => {
  const organicMolecule = molecules.filter(
    (molecule) => molecule.isOrganic && molecule.type,
  );
  const randomMoleculeIndex = Math.floor(
    Math.random() * organicMolecule.length,
  );
  const myRandomMolecule = organicMolecule[randomMoleculeIndex];

  const instruction = `Donner le nom de la molécule suivante : 
  $\\\\$ ![](https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/scienceAssets/molecules/${myRandomMolecule.formula}.png)`;

  const question: Question<Identifiers> = {
    instruction,
    answer: myRandomMolecule.iupact!,
    keys: [],
    answerFormat: "raw",
    identifiers: { randomMoleculeIndex },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const organicMolecule = molecules.filter(
    (molecule) => molecule.isOrganic && molecule.type,
  );
  while (propositions.length < n) {
    const randomMoleculeIndex = Math.floor(
      Math.random() * organicMolecule.length,
    );
    const myRandomMolecule = organicMolecule[randomMoleculeIndex];
    tryToAddWrongProp(propositions, myRandomMolecule.name, "raw");
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const moleculeNomenclature: ScienceExercise<Identifiers> = {
  id: "moleculeNomenclature",
  connector: "\\iff",
  label: "Donner le nom d'une molécule à partir de sa formule développée",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Chimie organique"],
  subject: "Chimie",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getMoleculeNomenclature, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
