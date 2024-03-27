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
import { Decimal } from "#root/math/numbers/decimals/decimal";
import { coprimesOf } from "#root/math/utils/arithmetic/coprimesOf";
import { round } from "#root/math/utils/round";
import { nucleonMass } from "#root/pc/constants/atoms";
import { AtomSymbols } from "#root/pc/molecularChemistry/atomSymbols";
import { atomes } from "#root/pc/molecularChemistry/atome";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { random } from "#root/utils/random";
import { requiresApostropheBefore } from "#root/utils/requiresApostropheBefore";

type Identifiers = {
  atomSymbol: AtomSymbols;
};

// const getScientificNotation = (number: number, decimals)=> {
//   const decimal =
// }

const getCalculateProtonsNumberFromMassQuestion: QuestionGenerator<
  Identifiers
> = () => {
  // const atom = atomes.find((a) => a.symbole === "Se")!;
  const atom = random(atomes.slice(0, 50));
  const atomNucleusMass = atom.masseAtomique * nucleonMass.value;
  const atomNucleusMassFormated = atomNucleusMass
    .toScientific(2)
    .toTex({ scientific: 2 });

  const instruction = `Le noyau d'un atome ${
    requiresApostropheBefore(atom.name) ? "d'" : "de "
  }${atom.name} a pour masse $m = ${atomNucleusMassFormated}$ et possède $${
    round(atom.masseAtomique, 0) - atom.numeroAtomique
  }$ neutrons.`;

  // const help = ` $m_{\\text{nucléon}} = ${nucleonMass.value
  //   .toScientific(2)
  //   .toTex({ scientific: 2 })}\\ ${nucleonMass.unit}$`;
  // console.log(instruction);
  const question: Question<Identifiers> = {
    answer: `${atom.numeroAtomique}`,
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

  while (propositions.length < n) {
    throw Error("QCM not implemented");
    // tryToAddWrongProp(propositions, `${n}`);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const calculateProtonsNumberFromMass: Exercise<Identifiers> = {
  id: "calculateProtonsNumberFromMass",
  label: "Déterminer le nombre de protons par la masse",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Chimie organique"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateProtonsNumberFromMassQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
