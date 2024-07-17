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
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { nucleonMass } from "#root/pc/constants/atoms";
import { Measure } from "#root/pc/measure/measure";
import { AtomSymbols } from "#root/pc/molecularChemistry/atomSymbols";
import { atomes } from "#root/pc/molecularChemistry/atome";
import { random } from "#root/utils/random";
import { requiresApostropheBefore } from "#root/utils/requiresApostropheBefore";
import { MassUnit } from "#root/pc/units/massUnits";

type Identifiers = {
  atomSymbol: AtomSymbols;
  sampleMass: number;
};

const getFindAtomEntitiesNumberFromMassQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const atom = random(atomes.slice(5, 30));
  const sampleMass = round(randfloat(0.1, 2), 2);
  const sampleMassMeasure = new Measure(sampleMass, 0, MassUnit.kg);
  const atomMass = nucleonMass.value.times(atom.masseAtomique).toSignificant(2);
  const entitiesNumber = sampleMassMeasure.divide(atomMass).toSignificant(2);
  console.log("entitiesNumber", entitiesNumber);

  const instruction = `Un échantillon a une masse $m = ${sampleMassMeasure.toTex()}$ ${
    requiresApostropheBefore(atom.name) ? "d'" : "de "
  }${atom.name}. La masse d'un atome ${
    requiresApostropheBefore(atom.name) ? "d'" : "de "
  }${atom.name} est de $${atomMass.toTex({ scientific: 2 })}$.
  Déterminer le nombre d'atomes ${
    requiresApostropheBefore(atom.name) ? "d'" : "de "
  }${atom.name} composant l'échantillon.`;

  const question: Question<Identifiers> = {
    answer: `${entitiesNumber.toSignificant(2).toTex()}`,
    instruction,
    keys: ["timesTenPower"],
    answerFormat: "tex",
    identifiers: { atomSymbol: atom.symbole, sampleMass },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, atomSymbol, sampleMass },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const atom = atomes.find((a) => a.symbole === atomSymbol)!;
  const sampleMassMeasure = new Measure(sampleMass, 0);

  const atomMass = nucleonMass.value.times(atom.masseAtomique).toSignificant(2);

  const entitiesNumber = sampleMassMeasure.divide(atomMass).toSignificant(2);
  const wrongDivision = atomMass.divide(sampleMassMeasure).toSignificant(2);
  tryToAddWrongProp(propositions, `${wrongDivision.toTex({ scientific: 2 })}`);

  const wrongCalculation = atomMass.times(sampleMassMeasure).toSignificant(2);
  tryToAddWrongProp(
    propositions,
    `${wrongCalculation.toTex({ scientific: 2 })}`,
  );
  while (propositions.length < n) {
    const wrongPower = entitiesNumber
      .times(new Measure(1, randint(-2, 2, [0])))
      .toTex({ scientific: 0, hideUnit: true });
    tryToAddWrongProp(propositions, `${wrongPower}`);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  // const atom = atomes.find(a => a.symbole === atomSymbol)!
  // const sampleMassMeasure = new Measure(sampleMass, 0);
  // const atomMass = nucleonMass.value.times(atom.masseAtomique).toSignificant(2);
  // const entitiesNumber = sampleMassMeasure.divide(atomMass).toSignificant(2);
  // const texs = entitiesNumber.toAllValidTexs();
  // return texs.includes(ans);
  return ans === answer;
};
export const findAtomEntitiesNumberFromMass: Exercise<Identifiers> = {
  id: "findAtomEntitiesNumberFromMass",
  label: "Déterminer le nombre d'entités d'un atome dans un échantillon",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Chimie organique"],
  generator: (nb: number) =>
    getDistinctQuestions(getFindAtomEntitiesNumberFromMassQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
