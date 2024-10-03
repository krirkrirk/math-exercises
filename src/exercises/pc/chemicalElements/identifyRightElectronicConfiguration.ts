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
import { AtomSymbols } from "#root/pc/constants/molecularChemistry/atomSymbols";
import { atomes } from "#root/pc/constants/molecularChemistry/atome";
import { random } from "#root/utils/random";
import { requiresApostropheBefore } from "#root/utils/strings/requiresApostropheBefore";

type Identifiers = {
  atomSymbol: AtomSymbols;
};

const getIdentifyRightElectronicConfigurationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const atom = random(getAtoms(3).slice(2));

  const question: Question<Identifiers> = {
    answer: `${getElectronicConfigurationFromShells(atom.electronsShells!)}`,
    instruction: `L'atome ${
      requiresApostropheBefore(atom.name) ? "d'" : "de "
    }${atom.name} a pour numéro atomique ${
      atom.numeroAtomique
    }. Quelle est sa configuration électronique ?`,
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
  const electrons = atom.numeroAtomique;

  if (electrons === 3) {
    tryToAddWrongProp(
      propositions,
      `${getElectronicConfigurationFromShells([1, 1, 1])}`,
    );
    tryToAddWrongProp(propositions, `1s^2\\ 2p^1`);
    tryToAddWrongProp(propositions, `1s^3`);
  }
  if (electrons === 4) {
    tryToAddWrongProp(propositions, `1p^2\\ 2s^2`);
  }

  while (propositions.length < n) {
    const wrongNumberInShells = shells.map((shell, index) => {
      if (electrons <= 4) {
        if (index === 1) return shell + 1;
        return shell;
      }
      if (electrons <= 10) {
        if (index === 2) return shell + 1;
        return shell;
      }
      if (electrons <= 12) {
        if (index === 3) return shell + 1;
        return shell;
      }
      if (index === 4) return shell + 1;

      return shell;
    });
    tryToAddWrongProp(
      propositions,
      `${getElectronicConfigurationFromShells(wrongNumberInShells)}`,
    );

    const wrongSecondLetter = getElectronicConfigurationFromShells(
      atom.electronsShells!,
    )
      .split("2s^")
      .join("2p^");
    tryToAddWrongProp(propositions, `${wrongSecondLetter}`);

    if (electrons >= 5) {
      const wrongThirdLetter = getElectronicConfigurationFromShells(
        atom.electronsShells!,
      )
        .split("2p^")
        .join("2s^");
      tryToAddWrongProp(propositions, `${wrongThirdLetter}`);
    }

    if (electrons >= 6) {
      const wrongShells = shells.map((shell, index) => {
        if (index === 0 || index > 2) return shell;
        if (index === 1) return shell + 1;
        if (index === 2) return shell - 1;
        return 1;
      });
      tryToAddWrongProp(
        propositions,
        `${getElectronicConfigurationFromShells(wrongShells)}`,
      );
    }
    tryToAddWrongProp(
      propositions,
      getElectronicConfigurationFromShells(atom.electronsShells!).replace(
        "s",
        "p",
      ),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const identifyRightElectronicConfiguration: Exercise<Identifiers> = {
  id: "identifyRightElectronicConfiguration",
  label: "Identifier la bonne configuration électronique",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Chimie organique"],
  generator: (nb: number) =>
    getDistinctQuestions(
      getIdentifyRightElectronicConfigurationQuestion,
      nb,
      16,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
  answerType: "QCU",
  maxAllowedQuestions: 16,
};
