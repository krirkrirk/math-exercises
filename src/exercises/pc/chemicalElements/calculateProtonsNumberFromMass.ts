import { coinFlip } from "./../../../utils/coinFlip";
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
import { Measure } from "#root/pc/measure/measure";
import { AtomSymbols } from "#root/pc/molecularChemistry/atomSymbols";
import { atomes } from "#root/pc/molecularChemistry/atome";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { random } from "#root/utils/random";
import { requiresApostropheBefore } from "#root/utils/requiresApostropheBefore";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  atomSymbol: AtomSymbols;
};

const getCalculateProtonsNumberFromMassQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const atom = random(atomes.slice(0, 50));
  const atomNucleusMass = nucleonMass.value.times(atom.masseAtomique);
  const instruction = `Le noyau d'un atome ${
    requiresApostropheBefore(atom.name) ? "d'" : "de "
  }${atom.name} a pour masse $m = ${atomNucleusMass.toTex({
    scientific: 2,
  })} kg$ et possède $${
    round(atom.masseAtomique, 0) - atom.numeroAtomique
  }$ neutrons. Déterminer le nombre de protons de cet atome.`;

  // const help = ` $m_{\\text{nucléon}} = ${nucleonMass.value.toTex({
  //   scientific: 2,
  // })}\\ ${nucleonMass.unit}$`;

  const question: Question<Identifiers> = {
    answer: `${atom.numeroAtomique}`,
    instruction: instruction,
    // instruction: instruction + help,
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

  tryToAddWrongProp(propositions, `${round(atom.masseAtomique, 0)}`);
  tryToAddWrongProp(
    propositions,
    `${round(atom.masseAtomique, 0) - atom.numeroAtomique}`,
  );
  while (propositions.length < n) {
    if (atom.numeroAtomique < 2) {
      tryToAddWrongProp(propositions, `${randint(2, 5)}`);
    }
    tryToAddWrongProp(
      propositions,
      `${
        coinFlip()
          ? atom.numeroAtomique + randint(1, atom.numeroAtomique + 1)
          : atom.numeroAtomique - randint(1, atom.numeroAtomique + 1)
      }`,
    );
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
