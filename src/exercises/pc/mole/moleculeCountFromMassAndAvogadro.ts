import { frenchify } from "#root/math/utils/latex/frenchify";
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
import { randfloat } from "#root/math/utils/random/randfloat";
import { round } from "#root/math/utils/round";
import { Measure } from "#root/pc/measure/measure";
import { molecules } from "#root/pc/molecularChemistry/molecule";
import { random } from "#root/utils/random";
import { randint } from "#root/math/utils/random/randint";
import { avogadroConstant } from "#root/pc/constants/atoms";
import { requiresApostropheBefore } from "#root/utils/requiresApostropheBefore";

type Identifiers = {
  moleculeName: string;
  sampleMass: number;
  molarMass: number;
};

const getMoleculeCountFromMassAndAvogadroQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const molecule = random(molecules);
  const sampleMass = randfloat(0.1, 2, 2); // Sample mass in grams
  const molarMass = molecule.weight; // Molar mass in g/mol
  const Na = avogadroConstant.value.toSignificant(2);
  const entitiesNumber = Na.times(sampleMass / molarMass).toSignificant(2);

  const instruction = `Un échantillon a une masse $m = ${frenchify(
    sampleMass,
  )}\\ g$ de ${requiresApostropheBefore(molecule.name) ? "d'" : "de "}${
    molecule.name
  }. La masse molaire ${
    requiresApostropheBefore(molecule.name) ? "d'" : "de "
  }${molecule.name} est de $${molarMass}\\ g/mol$.
  Déterminer le nombre de molécules ${
    requiresApostropheBefore(molecule.name) ? "d'" : "de "
  }${molecule.name}.`;

  const question: Question<Identifiers> = {
    answer: entitiesNumber.toTex(),
    instruction,
    keys: ["mol", "timesTenPower"],
    answerFormat: "tex",
    identifiers: { moleculeName: molecule.name, sampleMass, molarMass },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, moleculeName, sampleMass },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const Na = avogadroConstant.value.toSignificant(2);
  const molecule = molecules.find((m) => m.name === moleculeName)!;
  const molarMass = molecule.weight;

  const wrongDivision = Na.times(molarMass / sampleMass).toSignificant(2);
  tryToAddWrongProp(propositions, wrongDivision.toTex());

  const wrongCalculation = Na.times(sampleMass * molarMass).toSignificant(2);
  tryToAddWrongProp(propositions, wrongCalculation.toTex());

  while (propositions.length < n) {
    const wrongPower = Na.times(
      (sampleMass / molarMass) * Math.pow(10, randint(-2, 2, [0])),
    ).toSignificant(2);
    tryToAddWrongProp(propositions, wrongPower.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, sampleMass, molarMass },
) => {
  let latexs = [];
  const Na = avogadroConstant.value.toSignificant(2);
  const validanswer1 = Na.times(sampleMass / molarMass)
    .toSignificant(1)
    .toTex();
  const validanswer2 = Na.times(sampleMass / molarMass)
    .toSignificant(2)
    .toTex();
  const validanswer3 = Na.times(sampleMass / molarMass)
    .toSignificant(3)
    .toTex();

  latexs.push(validanswer1);
  latexs.push(validanswer2);
  latexs.push(validanswer3);

  return latexs.includes(ans);
};

export const MoleculeCountFromMassAndAvogadro: Exercise<Identifiers> = {
  id: "moleculeCountFromMassAndAvogadro",
  label: "Déterminer le nombre de molécules dans un échantillon",
  levels: ["2nde", "1reSpé"],
  isSingleStep: true,
  sections: ["Chimie organique"],
  generator: (nb: number) =>
    getDistinctQuestions(getMoleculeCountFromMassAndAvogadroQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
