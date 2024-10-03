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
import { round } from "#root/math/utils/round";
import { random } from "#root/utils/random";
import { requiresApostropheBefore } from "#root/utils/strings/requiresApostropheBefore";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { molecules } from "#root/pc/constants/molecularChemistry/molecule";

type Identifiers = {
  moleculeName: string;
  concentration: number;
  molarAbsorptivity: number;
  pathLength: number;
  absorbance: number;
  randomIndex: number;
};

const getBeerLambertRandomValueQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const molecule = random(molecules);
  const concentration = round(randfloat(0.01, 0.1), 2); // Concentration in mol/L
  const molarAbsorptivity = round(randfloat(10, 100), 1); // Molar absorptivity in L·mol^-1·cm^-1
  const pathLength = round(randfloat(1, 5), 1); // Path length in cm
  const absorbance = round(concentration * molarAbsorptivity * pathLength, 2); // Absorbance

  const variables = [
    {
      name: "concentration",
      value: concentration,
      unit: "\\text{mol} \\cdot \\text{L}^{-1}",
    },
    {
      name: "molarAbsorptivity",
      value: molarAbsorptivity,
      unit: "\\text{L} \\cdot \\text{mol}^{-1} \\cdot \\text{cm}^{-1}",
    },
    { name: "pathLength", value: pathLength, unit: "\\text{cm}" },
    { name: "absorbance", value: absorbance, unit: "" },
  ];

  const randomIndex = randint(0, variables.length);
  const targetVariable = variables[randomIndex];
  const knownVariables = variables.filter((_, index) => index !== randomIndex);

  const knownVariablesText = knownVariables
    .map(
      (v) =>
        `${
          v.name === "concentration"
            ? "- Concentration"
            : v.name === "molarAbsorptivity"
            ? "- Coefficient d'absorption molaire"
            : v.name === "pathLength"
            ? "- Longueur du trajet optique"
            : "- Absorbance"
        } : ${
          v.name === "concentration"
            ? "$C$"
            : v.name === "molarAbsorptivity"
            ? "$\\varepsilon$"
            : v.name === "pathLength"
            ? "$\\ell$"
            : "$A$"
        } = $${frenchify(v.value)}\\ ${v.unit}$`,
    )
    .join(",\n");

  const instruction = `Vous êtes en train de réaliser l'étalonnage d'une solution ${
    requiresApostropheBefore(molecule.name.toLowerCase()) ? "d'" : "de "
  }${molecule.name.toLowerCase()} en utilisant une solution étalon. Vous avez mesuré les données suivantes :\n
  ${knownVariablesText}.\n 
  
À partir de ces données, déterminez ${
    targetVariable.name === "concentration"
      ? "la concentration en $\\text{mol} \\cdot \\text{L}^{-1}$"
      : targetVariable.name === "molarAbsorptivity"
      ? "le coefficient d'absorption molaire en $\\text{L} \\cdot \\text{mol}^{-1} \\cdot \\text{cm}^{-1}$"
      : targetVariable.name === "pathLength"
      ? "la longueur du trajet optique en $\\text{cm}$"
      : "l'absorbance"
  } de cette solution.`;

  const hint = `Rappelez-vous la loi de Beer-Lambert : $A = \\varepsilon \\cdot C \\cdot \\ell$. Voici les éléments de cette formule :
- $A$ : l'absorbance
- $\\varepsilon$ : le coefficient d'absorption molaire en $\\text{L} \\cdot \\text{mol}^{-1} \\cdot \\text{cm}^{-1}$
- $C$ : la concentration en $\\text{mol} \\cdot \\text{L}^{-1}$
- $\\ell$ : la longueur du trajet optique en $\\text{cm}$ 
  
Réorganisez cette formule pour isoler la variable à trouver.`;

  const correction = `La loi de Beer-Lambert est donnée par :
  $$A = \\varepsilon \\cdot \\ell \\cdot C$$ 

  Pour résoudre le problème, nous devons réorganiser la formule pour isoler la variable inconnue. En utilisant les valeurs fournies pour $\\varepsilon$, $C$, et $\\ell$, nous pouvons résoudre pour trouver la variable manquante.

  Si $A$ est l'absorbance, $\\varepsilon$ est le coefficient d'absorption molaire, $C$ est la concentration et $\\ell$ est la longueur du trajet optique, alors:

  ${
    targetVariable.name === "concentration"
      ? "$$C = \\frac{A}{\\varepsilon \\cdot \\ell}$$"
      : ""
  }
  ${
    targetVariable.name === "molarAbsorptivity"
      ? "$$\\varepsilon = \\frac{A}{C \\cdot \\ell}$$"
      : ""
  }
  ${
    targetVariable.name === "pathLength"
      ? "$$\\ell = \\frac{A}{\\varepsilon \\cdot C}$$"
      : ""
  }
  ${
    targetVariable.name === "absorbance"
      ? "$$A = \\varepsilon \\cdot C \\cdot \\ell$$"
      : ""
  }

  En appliquant les valeurs:

  ${
    targetVariable.name === "concentration"
      ? `$$C = \\frac{${frenchify(absorbance)}}{${frenchify(
          molarAbsorptivity,
        )} \\cdot ${frenchify(pathLength)}} = ${frenchify(
          round(absorbance / (molarAbsorptivity * pathLength), 2),
        )}\\ \\text{mol} \\cdot \\text{L}^{-1}$$`
      : ""
  }
  ${
    targetVariable.name === "molarAbsorptivity"
      ? `$$\\varepsilon = \\frac{${frenchify(absorbance)}}{${frenchify(
          concentration,
        )} \\cdot ${frenchify(pathLength)}} = ${frenchify(
          round(absorbance / (concentration * pathLength), 1),
        )}\\ \\text{L} \\cdot \\text{mol}^{-1} \\cdot \\text{cm}^{-1}$$`
      : ""
  }
  ${
    targetVariable.name === "pathLength"
      ? `$$\\ell = \\frac{${frenchify(absorbance)}}{${frenchify(
          molarAbsorptivity,
        )} \\cdot ${frenchify(concentration)}} = ${frenchify(
          round(absorbance / (molarAbsorptivity * concentration), 1),
        )}\\ \\text{cm}$$`
      : ""
  }
  ${
    targetVariable.name === "absorbance"
      ? `$$A = ${frenchify(molarAbsorptivity)} \\cdot ${frenchify(
          concentration,
        )} \\cdot ${frenchify(pathLength)} = ${frenchify(absorbance)}$$`
      : ""
  }`;

  const question: Question<Identifiers> = {
    answer: targetVariable.value.toTree().toTex(),
    instruction,
    hint,
    correction,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      moleculeName: molecule.name.toLowerCase(),
      concentration,
      molarAbsorptivity,
      pathLength,
      absorbance,
      randomIndex,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, concentration, molarAbsorptivity, pathLength, absorbance },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, concentration.toTree().toTex());
  tryToAddWrongProp(propositions, molarAbsorptivity.toTree().toTex());
  tryToAddWrongProp(propositions, pathLength.toTree().toTex());
  tryToAddWrongProp(propositions, absorbance.toTree().toTex());

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(0, 10, 2).toTree().toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  {
    answer,
    randomIndex,
    concentration,
    molarAbsorptivity,
    pathLength,
    absorbance,
  },
) => {
  const variables = [
    {
      name: "concentration",
      value: concentration,
      unit: "\\text{mol} \\cdot \\text{L}^{-1}",
    },
    {
      name: "molarAbsorptivity",
      value: molarAbsorptivity,
      unit: "\\text{L} \\cdot \\text{mol}^{-1} \\cdot \\text{cm}^{-1}",
    },
    { name: "pathLength", value: pathLength, unit: "\\text{cm}" },
    { name: "absorbance", value: absorbance, unit: "" },
  ];
  const validAnswer = variables[randomIndex].value;
  const latexs = validAnswer.toTree().toAllValidTexs();

  return latexs.includes(ans);
};

export const BeerLambertRandomValueExercise: Exercise<Identifiers> = {
  id: "beerLambertRandomValue",
  label: "Utiliser la loi de Beer-Lambert",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Spectrophotométrie"],
  generator: (nb: number) =>
    getDistinctQuestions(getBeerLambertRandomValueQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
  hasHintAndCorrection: true,
};
