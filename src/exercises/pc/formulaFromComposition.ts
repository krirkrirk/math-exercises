import {
  Exercise,
  Proposition,
  Question,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
  QuestionGenerator,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { atomes } from "#root/pc/molecularChemistry/atome";
import { molecules } from "#root/pc/molecularChemistry/molecule";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  randomMoleculeIndex: number;
};

const getFormulaFromComposition: QuestionGenerator<Identifiers> = () => {
  const moleculesWith2Atoms = molecules.filter(
    (molecule) => molecule.atoms.length === 2 && molecule.state !== "aqueous",
  );

  const randomMoleculeIndex = Math.floor(
    Math.random() * moleculesWith2Atoms.length,
  );
  const myRandomMolecule = moleculesWith2Atoms[randomMoleculeIndex];

  const [elementName1, elementName2] = myRandomMolecule.atoms.map(
    (el) => el.atom.symbole,
  );
  const [elementcount1, elementcount2] = myRandomMolecule.atoms.map(
    (el) => el.count,
  );

  const elementMolarMass1 = atomes.find(
    (el) => el.symbole === elementName1,
  )!.masseAtomique;
  const elementMolarMass2 = atomes.find(
    (el) => el.symbole === elementName2,
  )!.masseAtomique;

  const percentageElement1 = round(
    ((elementcount1 * elementMolarMass1) /
      (elementcount1 * elementMolarMass1 + elementcount2 * elementMolarMass2)) *
      100,
    2,
  );
  const percentageElement2 = round(
    ((elementcount2 * elementMolarMass2) /
      (elementcount1 * elementMolarMass1 + elementcount2 * elementMolarMass2)) *
      100,
    2,
  );

  const answer = myRandomMolecule.formula;
  const question: Question<Identifiers> = {
    instruction: `Déterminer la formule brute $${elementName1}_x${elementName2}_y$ à partir de la composition centésimale $${elementName1}$ : $${percentageElement1}$ $\\%$ $${elementName2}$ : $${percentageElement2}$ $\\%$.`,
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
  const moleculesWith2Atoms = molecules.filter(
    (molecule) => molecule.atoms.length === 2 && molecule.state !== "aqueous",
  );
  const myRandomMolecule = moleculesWith2Atoms[randomMoleculeIndex];

  const [elementName1, elementName2] = myRandomMolecule.atoms.map(
    (el) => el.atom.symbole,
  );

  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const randomElementCount1 = randint(1, 6);
    const randomElementCount2 = randint(1, 6);

    const randomElement1 =
      randomElementCount1 === 1
        ? elementName1
        : `${elementName1}_${randomElementCount1}`;
    const randomElement2 =
      randomElementCount2 === 1
        ? elementName2
        : `${elementName2}_${randomElementCount2}`;
    tryToAddWrongProp(propositions, `${randomElement1}${randomElement2}`);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const formulaFromComposition: Exercise<Identifiers> = {
  id: "formulaFromComposition",
  connector: "\\iff",
  label: "Déterminer la formule brute à partir de la composition centésimale",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Chimie organique"],
  subject: "Chimie",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getFormulaFromComposition, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
