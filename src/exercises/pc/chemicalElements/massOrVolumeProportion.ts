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
import { random } from "#root/utils/random";
import { molecules } from "#root/pc/molecularChemistry/molecule";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { requiresApostropheBefore } from "#root/utils/requiresApostropheBefore";
import { coinFlip } from "#root/utils/coinFlip";
import { round } from "#root/math/utils/round";

type Identifiers = {
  totalMass: number;
  totalVolume: number;
  elementMass: number;
  elementVolume: number;
  targetProportion: "massique" | "volumique";
};

const getMassOrVolumeProportionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const molecule = random(molecules);
  const elementName = molecule.name;

  const totalMass = randfloat(50, 500, 2); // Total mass in grams
  const totalVolume = randfloat(100, 1000, 2); // Total volume in milliliters
  const elementMass = randfloat(10, 50, 2); // Element mass in grams
  const elementVolume = randfloat(20, 100, 2); // Element volume in milliliters

  const massProportion = elementMass / totalMass;
  const volumeProportion = elementVolume / totalVolume;

  const targetProportion = coinFlip() ? "massique" : "volumique";
  const proportion =
    targetProportion === "massique" ? massProportion : volumeProportion;

  const instruction = `Vous travaillez dans un laboratoire et vous avez préparé une solution contenant ${
    requiresApostropheBefore(elementName) ? "de l'" : "du "
  }${elementName}. Voici les données que vous avez mesurées : \n
  - Masse totale de la solution : $${frenchify(totalMass)}\\ g$, \n
  - Volume total de la solution : $${frenchify(totalVolume)}\\ mL$, \n
  - Masse ${
    requiresApostropheBefore(elementName) ? "d'" : "de "
  }${elementName} dans la solution : $${frenchify(elementMass)}\\ g$, \n
  - Volume de ${elementName} dans la solution : $${frenchify(
    elementVolume,
  )}\\ mL$. \n
  Calculez la proportion ${targetProportion} ${
    requiresApostropheBefore(elementName) ? "d'" : "de "
  }${elementName} dans la solution.`;

  const hint = `${
    targetProportion === "massique"
      ? `La proportion ${targetProportion} est donnée par le rapport entre la masse de l'élément et la masse totale de la solution.`
      : `La proportion ${targetProportion} est donnée par le rapport entre le volume de l'élément et le volume totale de la solution.`
  }`;
  const correction = `Pour calculer la proportion ${targetProportion}, on utilise la formule : 
  $${
    targetProportion === "massique"
      ? `\\text{Proportion massique} = \\frac{\\text{Masse de l'élément}}{\\text{Masse totale}} = \\frac{${elementMass
          .toScientific(2)
          .toTex()}}{${totalMass.toScientific(2).toTex()}} = ${frenchify(
          proportion.toScientific(2).toTex(),
        )}`
      : `\\text{Proportion volumique} = \\frac{\\text{Volume de l'élément}}{\\text{Volume total}} = \\frac{${elementVolume
          .toScientific(2)
          .toTex()}}{${totalVolume.toScientific(2).toTex()}} = ${frenchify(
          proportion.toScientific(2).toTex(),
        )}`
  }$`;

  const question: Question<Identifiers> = {
    answer: proportion.toScientific(2).toTex(),
    instruction,
    hint,
    correction,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      totalMass,
      totalVolume,
      elementMass,
      elementVolume,
      targetProportion,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  {
    answer,
    elementMass,
    elementVolume,
    totalMass,
    totalVolume,
    targetProportion,
  },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const w1 = (elementMass / totalVolume).toScientific(2).toTex();
  const w2 = (elementVolume / totalMass).toScientific(2).toTex();
  const w3 =
    targetProportion === "massique"
      ? (elementMass * totalMass).toScientific(2).toTex()
      : (elementVolume * totalVolume).toScientific(2).toTex();

  tryToAddWrongProp(propositions, w1);
  tryToAddWrongProp(propositions, w2);
  tryToAddWrongProp(propositions, w3);

  while (propositions.length < n) {
    const wrongProportion = randfloat(0.01, 0.1, 2).toScientific(2).toTex();
    tryToAddWrongProp(propositions, wrongProportion);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  {
    answer,
    totalMass,
    totalVolume,
    elementMass,
    elementVolume,
    targetProportion,
  },
) => {
  const massProportion = elementMass / totalMass;
  const volumeProportion = elementVolume / totalVolume;

  const proportion =
    targetProportion === "massique" ? massProportion : volumeProportion;
  const validAnswer1 = proportion.toScientific(2).toTex();
  const validAnswer2 = round(proportion, 2).toTree().toTex();
  const validAnswer3 = proportion.toScientific(3).toTex();
  const validAnswer4 = proportion.toScientific(1).toTex();

  let latexs = [];
  latexs.push(validAnswer1, validAnswer2, validAnswer3, validAnswer4);

  return latexs.includes(ans);
};

export const MassOrVolumeProportionExercise: Exercise<Identifiers> = {
  id: "massOrVolumeProportion",
  label:
    "Calculer la proportion massique ou volumique d'un élément dans une solution",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Chimie des solutions"],
  generator: (nb: number) =>
    getDistinctQuestions(getMassOrVolumeProportionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
