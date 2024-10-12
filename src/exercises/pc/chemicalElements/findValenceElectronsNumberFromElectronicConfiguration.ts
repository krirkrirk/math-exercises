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
import { getAtoms } from "#root/exercises/utils/getAtoms";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { getElectronicConfigurationFromShells } from "#root/exercises/utils/getElectronicConfigurationFromShells";
import { randint } from "#root/math/utils/random/randint";
import { AtomSymbols } from "#root/pc/constants/molecularChemistry/atomSymbols";
import { atomes } from "#root/pc/constants/molecularChemistry/atome";
import { random } from "#root/utils/alea/random";
import { requiresApostropheBefore } from "#root/utils/strings/requiresApostropheBefore";

type Identifiers = {
  atomSymbol: AtomSymbols;
};

const getFindValenceElectronsNumberFromElectronicConfigurationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const atom = random(getAtoms(3));
  const configurationTex = getElectronicConfigurationFromShells(
    atom.electronsShells!,
  );
  const instruction = `
  La configuration d'un atome ${
    requiresApostropheBefore(atom.name) ? "d'" : "de "
  }${
    atom.name
  } est : $${configurationTex}$. Dénombrer le nombre d'électrons de valence de cet atome.`;

  const question: Question<Identifiers> = {
    answer: `${atom.valenceElectronsNumber}`,
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
  const shells = atom.electronsShells!;

  tryToAddWrongProp(propositions, `${shells.reduce((a, b) => a + b)}`);
  tryToAddWrongProp(propositions, `${shells[shells.length - 1]}`);

  if (shells.length > 1) {
    tryToAddWrongProp(
      propositions,
      `${shells[shells.length - 1] + shells[shells.length - 2]}`,
    );
  }
  tryToAddWrongProp(propositions, "2");

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, `${randint(0, 6)}`);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const findValenceElectronsNumberFromElectronicConfiguration: Exercise<Identifiers> =
  {
    id: "findValenceElectronsNumberFromElectronicConfiguration",
    label:
      "Dénombrer les électrons de valence par la configuration électronique",
    levels: ["2nde"],
    isSingleStep: true,
    sections: ["Chimie organique"],
    generator: (nb: number) =>
      getDistinctQuestions(
        getFindValenceElectronsNumberFromElectronicConfigurationQuestion,
        nb,
        18,
      ),
    qcmTimer: 60,
    freeTimer: 60,
    getPropositions,
    isAnswerValid,
    subject: "Chimie",
    maxAllowedQuestions: 18,
  };
