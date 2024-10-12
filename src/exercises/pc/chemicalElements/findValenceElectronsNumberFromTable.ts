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
import { randint } from "#root/math/utils/random/randint";
import { AtomSymbols } from "#root/pc/constants/molecularChemistry/atomSymbols";
import { atomes } from "#root/pc/constants/molecularChemistry/atome";
import { random } from "#root/utils/alea/random";
import { requiresApostropheBefore } from "#root/utils/strings/requiresApostropheBefore";

type Identifiers = {
  atomSymbol: AtomSymbols;
};

const getFindValenceElectronsNumberFromTableQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const atom = random(getAtoms(3));
  const instruction = `
  À l'aide du tableau périodique simplifié, définir le nombre d'électrons de valence d'un atome ${
    requiresApostropheBefore(atom.name) ? "d'" : "de "
  }${atom.name}. 
  ![](https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/activities/quizzes/generator/periodicTable.png)`;

  const question: Question<Identifiers> = {
    answer: `${atom.valenceElectronsNumber}`,
    instruction,
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
  const atomsWithTheSameInitial = getAtoms(3).filter(
    (a) => a.symbole[0] === atomSymbol[0],
  );
  tryToAddWrongProp(propositions, `${atom.valenceElectronsNumber! + 10}`);
  if (atomsWithTheSameInitial?.length) {
    atomsWithTheSameInitial.forEach(
      (atom) =>
        tryToAddWrongProp(propositions, `${atom.valenceElectronsNumber}`),
      tryToAddWrongProp(propositions, `${atom.numeroAtomique}`),
    );
  }
  if (atom.valenceElectronsNumber! - 2 >= 0) {
    tryToAddWrongProp(propositions, `${atom.valenceElectronsNumber! - 2}`);
  }
  tryToAddWrongProp(propositions, `${atom.numeroAtomique}`);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, `${randint(1, 19)}`);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const findValenceElectronsNumberFromTable: Exercise<Identifiers> = {
  id: "findValenceElectronsNumberFromTable",
  label: "Dénombrer les électrons de valence à l'aide du tableau périodique",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Chimie organique"],
  generator: (nb: number) =>
    getDistinctQuestions(
      getFindValenceElectronsNumberFromTableQuestion,
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
