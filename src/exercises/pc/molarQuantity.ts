import {
  Exercise,
  Proposition,
  Question,
  QuestionGenerator,
  QCMGenerator,
  VEA,
  tryToAddWrongProp,
  addValidProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { frenchify } from "#root/math/utils/latex/frenchify";
import { round } from "#root/math/utils/round";
import { atomes } from "#root/pc/molecularChemistry/atome";
import { molecules } from "#root/pc/molecularChemistry/molecule";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  mG: number;
  randomMoleculeIndex: number;
};

const getMolarQuantityQuestion: QuestionGenerator<Identifiers> = () => {
  const mG = round(Math.random() * 150 + 50, 0); // Masse de l'échantillon en g (entre 50 et 200 g)

  const moleculesSolid = molecules.filter(
    (molecule) => molecule.state === "solid",
  );
  const randomMoleculeIndex = Math.floor(Math.random() * moleculesSolid.length);
  const myRandomMolecule = moleculesSolid[randomMoleculeIndex];
  const molarMassG = round(myRandomMolecule.weight, 2); // Masse molaire en g/mol

  const nG = mG / molarMassG;

  const myAtoms = myRandomMolecule.atoms.map((el) => el.atom.name);
  const myAtomsMolarMass = myAtoms.map((atome) => {
    return atomes.find((el) => el.name === atome)?.masseAtomique;
  });

  const res = myAtomsMolarMass
    .map(
      (molarMass, index) =>
        `$M_{(${
          myRandomMolecule.atoms[index].atom.symbole
        })}$ = $${molarMass?.toFixed(0)}$ $g/mol$ ; `,
    )
    .join("");

  const instruction = `Un échantillon de ${myRandomMolecule.name} $${myRandomMolecule.formula}$ a une masse de ${mG} g. 
  Déterminer la quantité de matière $n$ contenue dans cet échantillon de ${myRandomMolecule.name}. 
  $\\\\$ On donne : ${res}`;

  const answer = `${frenchify(round(nG, 2))}\\ mol`;
  const question: Question<Identifiers> = {
    instruction,
    startStatement: "n",
    answer,
    keys: ["mol"],
    answerFormat: "tex",
    identifiers: { mG, randomMoleculeIndex },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      frenchify(round(Math.random() * 5, 2)) + "\\ mol",
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const molarQuantity: Exercise<Identifiers> = {
  id: "molarQuantity",
  connector: "=",
  label: "Calculer une quantité de matière",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Constitution et transformations de la matière"],
  subject: "Chimie",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getMolarQuantityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
