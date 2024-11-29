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
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";
import { requiresApostropheBefore } from "#root/utils/strings/requiresApostropheBefore";
import { getAtoms } from "../utils/getAtoms";

type Identifiers = {
  atomicMass: number;
  atomicNumber: number;
  isAsking: string;
  symbol: string;
};

const getIdentifyAtomicMassOrAtomicNbQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExercise();
  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: `À l'aide du tableau périodique simplifié, déterminer ${
      exo.isAsking
    } d'un atome ${requiresApostropheBefore(exo.atom.name) ? "d'" : "de "}${
      exo.atom.name
    }![](https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/activities/quizzes/generator/periodicTable2.png)`,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      atomicMass: exo.atomicMasss,
      atomicNumber: exo.atomicNumber,
      isAsking: exo.isAsking,
      symbol: exo.atom.symbole,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, atomicMass, atomicNumber },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    +answer === atomicMass
      ? atomicNumber.toTree().toTex()
      : atomicMass.toTree().toTex(),
  );
  tryToAddWrongProp(
    propositions,
    round(atomicMass + atomicNumber, 2, false)
      .toTree()
      .toTex(),
  );
  while (propositions.length < n) {
    let random = randint(
      +answer.replaceAll(",", ".") -
        Math.min(+answer.replaceAll(",", "."), 5) -
        1,
      +answer.replaceAll(",", ".") + 5,
      [+answer.replaceAll(",", ".")],
    );
    tryToAddWrongProp(propositions, round(random, 2, false).toTree().toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateExercise = () => {
  const atoms = getAtoms(3);
  const atom = random(atoms);
  const isAsking = coinFlip() ? "la masse atomique" : "le numéro atomique";
  return {
    atom,
    isAsking,
    answer:
      isAsking == "la masse atomique"
        ? atom.masseAtomique.toTree().toTex()
        : atom.numeroAtomique.toTree().toTex(),
    atomicMasss: atom.masseAtomique,
    atomicNumber: atom.numeroAtomique,
  };
};
export const identifyAtomicMassOrAtomicNb: Exercise<Identifiers> = {
  id: "identifyAtomicMassOrAtomicNb",
  label: "Identifier la masse atomique et le numéro atomique",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Chimie organique"],
  generator: (nb: number) =>
    getDistinctQuestions(getIdentifyAtomicMassOrAtomicNbQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
